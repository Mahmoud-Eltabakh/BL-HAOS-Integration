"""Async REST and WebSocket client for the BL-HAOS native bridge."""

from __future__ import annotations

import asyncio
import re
from collections.abc import Callable
from typing import Any
from urllib.parse import urlsplit, urlunsplit

import aiohttp
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import BRIDGE_ID, NATIVE_API_PATH

_MAC_ADDRESS = re.compile(r"^[0-9a-f]{2}(?::[0-9a-f]{2}){5}$")


def normalize_address(address: str) -> str | None:
    """Return a canonical Bluetooth MAC address or reject the value."""
    normalized = address.strip().lower().replace("-", ":")
    return normalized if _MAC_ADDRESS.fullmatch(normalized) else None


class BLHAOSClient:
    """Maintain the cached state of trusted BL-HAOS speakers."""

    def __init__(self, hass: HomeAssistant, endpoint: str) -> None:
        self.hass = hass
        self.endpoint = endpoint.rstrip("/")
        self.speakers: dict[str, dict[str, Any]] = {}
        self._update_listeners: set[Callable[[str], None]] = set()
        self._websocket_task: asyncio.Task[None] | None = None
        self._closed = False
        self.transport_available = False

    @property
    def _headers(self) -> dict[str, str]:
        return {}

    async def async_initialize(self) -> None:
        """Validate identity, cache the snapshot, and start event updates."""
        session = async_get_clientsession(self.hass)
        async with session.get(f"{self.endpoint}{NATIVE_API_PATH}/identity", headers=self._headers) as response:
            identity = await response.json()
            if response.status != 200 or identity.get("bridge_id") != BRIDGE_ID:
                raise aiohttp.ClientError("Unexpected BL-HAOS native bridge identity")
        await self._async_refresh_snapshot(session)
        self.transport_available = True
        if self._websocket_task is None:
            self._websocket_task = self.hass.async_create_task(self._async_listen())

    async def _async_refresh_snapshot(self, session: aiohttp.ClientSession) -> None:
        async with session.get(f"{self.endpoint}{NATIVE_API_PATH}/speakers", headers=self._headers) as response:
            payload = await response.json()
            if response.status != 200:
                raise aiohttp.ClientError("Unable to load BL-HAOS speakers")
        for speaker in payload.get("speakers", {}).values():
            self._async_process_speaker(speaker)

    async def async_command(self, address: str, operation: str, **options: Any) -> dict[str, Any]:
        """Submit a native command and cache its authoritative acknowledgement."""
        normalized = normalize_address(address)
        if normalized is None:
            raise aiohttp.ClientError("Invalid Bluetooth address")
        payload = {"version": 1, "operation": operation, **{key: value for key, value in options.items() if value is not None}}
        session = async_get_clientsession(self.hass)
        async with session.post(
            f"{self.endpoint}{NATIVE_API_PATH}/speakers/{normalized}/command", headers=self._headers, json=payload
        ) as response:
            body = await response.json()
            if response.status != 200:
                raise aiohttp.ClientError(body.get("detail", "BL-HAOS command failed"))
        self._async_process_speaker(body)
        return self.speakers[normalized]

    def async_add_listener(self, listener: Callable[[str], None]) -> Callable[[], None]:
        """Register a cache callback and return its unsubscribe function."""
        self._update_listeners.add(listener)

        def _remove() -> None:
            self._update_listeners.discard(listener)

        return _remove

    def get_speaker(self, address: str) -> dict[str, Any] | None:
        """Read cached speaker data without network I/O."""
        return self.speakers.get(address)

    def _async_process_speaker(self, speaker: Any) -> None:
        if not isinstance(speaker, dict):
            return
        is_audio = speaker.get("is_audio_sink", True)
        is_valid_sink = bool(speaker.get("trusted") or speaker.get("paired") or speaker.get("connected") or speaker.get("available"))
        if not (is_audio and is_valid_sink):
            return
        address = normalize_address(str(speaker.get("address", "")))
        if address is None:
            return
        normalized_speaker = {**speaker, "address": address}
        if self.speakers.get(address) == normalized_speaker:
            return
        self.speakers[address] = normalized_speaker
        for listener in tuple(self._update_listeners):
            listener(address)

    async def _async_listen(self) -> None:
        """Reconnect to the native event stream until the entry is unloaded."""
        parsed = urlsplit(self.endpoint)
        websocket_url = urlunsplit(("ws", parsed.netloc, "/ws/native", "", ""))
        delay = 1
        session = async_get_clientsession(self.hass)
        while not self._closed:
            try:
                async with session.ws_connect(websocket_url, headers=self._headers) as websocket:
                    delay = 1
                    await self._async_refresh_snapshot(session)
                    self._set_transport_available(True)
                    async for message in websocket:
                        if message.type == aiohttp.WSMsgType.TEXT:
                            payload = message.json()
                            if payload.get("event") == "speaker_updated":
                                self._async_process_speaker(payload.get("data"))
            except (aiohttp.ClientError, asyncio.TimeoutError, ValueError):
                pass
            if self._closed:
                return
            self._set_transport_available(False)
            await asyncio.sleep(delay)
            delay = min(delay * 2, 30)

    def _set_transport_available(self, available: bool) -> None:
        if self.transport_available == available:
            return
        self.transport_available = available
        for listener in tuple(self._update_listeners):
            for address in self.speakers:
                listener(address)

    async def async_close(self) -> None:
        """Stop the event listener and discard entry-local callbacks."""
        self._closed = True
        if self._websocket_task:
            self._websocket_task.cancel()
            await asyncio.gather(self._websocket_task, return_exceptions=True)
            self._websocket_task = None
        self._update_listeners.clear()