"""Async REST and WebSocket client for the BL-HAOS native bridge."""

from __future__ import annotations

import asyncio
import logging
import re
from datetime import datetime, timezone
from http import HTTPStatus
from time import monotonic
from collections.abc import Callable
from typing import Any
from urllib.parse import urlsplit, urlunsplit

import aiohttp
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import (
    AUTH_FAILURE_MARKER,
    BEARER_PREFIX,
    BRIDGE_ID,
    COMMAND_TIMEOUT_SECONDS,
    COMMAND_VERSION,
    ERROR_CODE_INVALID_TOKEN,
    EVENT_SPEAKER_UPDATED,
    NATIVE_API_PATH,
    PAYLOAD_ADDRESS_KEY,
    PAYLOAD_AVAILABLE_KEY,
    PAYLOAD_BRIDGE_ID_KEY,
    PAYLOAD_CONNECTED_KEY,
    PAYLOAD_DATA_KEY,
    PAYLOAD_DETAIL_KEY,
    PAYLOAD_ERROR_CODE_KEY,
    PAYLOAD_ERROR_KEY,
    PAYLOAD_EVENT_KEY,
    PAYLOAD_IS_AUDIO_SINK_KEY,
    PAYLOAD_OPERATION_KEY,
    PAYLOAD_PAIRED_KEY,
    PAYLOAD_PLAYBACK_KEY,
    PAYLOAD_SPEAKERS_KEY,
    PAYLOAD_STATE_KEY,
    PAYLOAD_TRUSTED_KEY,
    PAYLOAD_VERSION_KEY,
    PAYLOAD_VOLUME_KEY,
    STREAM_RECONNECT_BASE_DELAY_SECONDS,
    STREAM_RECONNECT_MAX_DELAY_SECONDS,
    WEBSOCKET_HEARTBEAT_SECONDS,
    WEBSOCKET_NATIVE_PATH,
)

_MAC_ADDRESS = re.compile(r"^[0-9a-f]{2}(?::[0-9a-f]{2}){5}$")
_COMMAND_TIMEOUT = aiohttp.ClientTimeout(total=COMMAND_TIMEOUT_SECONDS)
_LOGGER = logging.getLogger(__name__)
# The add-on restarts on every add-on update, config change, or Supervisor
# restart, and each restart drops the event stream. Logging every retry turns a
# single restart into a burst of warnings in the Home Assistant log, so an outage
# is reported once and the recovery is reported when it ends.
STREAM_RECONNECT_BASE_DELAY = STREAM_RECONNECT_BASE_DELAY_SECONDS
STREAM_RECONNECT_MAX_DELAY = STREAM_RECONNECT_MAX_DELAY_SECONDS



def _redacted_address(address: str) -> str:
    """Keep logs useful without recording a complete Bluetooth address."""
    return f"...:{address[-5:]}"


def normalize_address(address: str) -> str | None:
    """Return a canonical Bluetooth MAC address or reject the value."""
    normalized = address.strip().lower().replace("-", ":")
    return normalized if _MAC_ADDRESS.fullmatch(normalized) else None


class BLHAOSClient:
    """Maintain the cached state of trusted BL-HAOS speakers."""

    def __init__(self, hass: HomeAssistant, endpoint: str, token: str) -> None:
        self.hass = hass
        self.endpoint = endpoint.rstrip("/")
        self.token = token
        self.speakers: dict[str, dict[str, Any]] = {}
        self._update_listeners: set[Callable[[str], None]] = set()
        self._websocket_task: asyncio.Task[None] | None = None
        self._closed = False
        self.transport_available = False
        self.auth_failed = False
        # Event-stream history, surfaced through diagnostics so a drop is
        # explainable without reading the Home Assistant log. An outage is one
        # loss of the stream; failed_attempts counts the retries inside it.
        self.stream_outages = 0
        self.stream_failed_attempts = 0
        self.stream_reconnects = 0
        self.consecutive_failures = 0
        self.last_disconnect_reason: str | None = None
        self.last_disconnect_at: str | None = None
        self.last_recovery_at: str | None = None
        self.last_outage_seconds: float | None = None
        self._outage_started: float | None = None

    @property
    def _headers(self) -> dict[str, str]:
        return {"Authorization": f"{BEARER_PREFIX}{self.token}"}

    @staticmethod
    def _response_error(status: int, body: Any, fallback: str) -> aiohttp.ClientError:
        """Build a transport error from an HTTP response without assuming a dict body.

        Proxies, gateways, and error pages can return any content type; a bare
        ``body.get(...)`` on a non-dict payload raises AttributeError and masks
        the real HTTP failure.
        """
        if isinstance(body, dict):
            detail = body.get(PAYLOAD_DETAIL_KEY) or body.get(PAYLOAD_ERROR_KEY) or fallback
            if body.get(PAYLOAD_ERROR_CODE_KEY) == ERROR_CODE_INVALID_TOKEN or status in (HTTPStatus.UNAUTHORIZED, HTTPStatus.FORBIDDEN):
                return aiohttp.ClientError(f"BL-HAOS authentication failed (HTTP {status}): {detail}")
            return aiohttp.ClientError(detail if isinstance(detail, str) else fallback)
        return aiohttp.ClientError(fallback)

    async def async_initialize(self) -> None:
        """Validate identity, cache the snapshot, and start event updates."""
        _LOGGER.debug("Initializing BL-HAOS client at %s", self.endpoint)
        session = async_get_clientsession(self.hass)
        async with session.get(f"{self.endpoint}{NATIVE_API_PATH}/identity", headers=self._headers) as response:
            identity = await response.json(content_type=None)
            if response.status != HTTPStatus.OK or not isinstance(identity, dict) or identity.get(PAYLOAD_BRIDGE_ID_KEY) != BRIDGE_ID:
                raise self._response_error(
                    response.status, identity, "Unexpected BL-HAOS native bridge identity"
                )
        _LOGGER.debug("BL-HAOS native bridge identity verified: %s", identity)
        await self._async_refresh_snapshot(session)
        self.transport_available = True
        _LOGGER.debug(
            "BL-HAOS client initialized: %d speakers loaded, starting event listener",
            len(self.speakers),
        )
        if self._websocket_task is None:
            create_background_task = getattr(self.hass, "async_create_background_task", None)
            if create_background_task is not None:
                self._websocket_task = create_background_task(self._async_listen(), name="bl_haos_websocket")
            else:
                self._websocket_task = self.hass.async_create_task(self._async_listen())

    async def _async_refresh_snapshot(self, session: aiohttp.ClientSession) -> None:
        _LOGGER.debug("Refreshing speakers snapshot from %s%s", self.endpoint, NATIVE_API_PATH)
        async with session.get(f"{self.endpoint}{NATIVE_API_PATH}/speakers", headers=self._headers) as response:
            payload = await response.json(content_type=None)
            if response.status != HTTPStatus.OK:
                raise self._response_error(response.status, payload, "Unable to load BL-HAOS speakers")
        if not isinstance(payload, dict) or not isinstance(payload.get(PAYLOAD_SPEAKERS_KEY), dict):
            raise ValueError("Invalid BL-HAOS speakers snapshot")
        snapshot_addresses: set[str] = set()
        for speaker in payload[PAYLOAD_SPEAKERS_KEY].values():
            address = self._async_process_speaker(speaker)
            if address is not None:
                snapshot_addresses.add(address)
        evicted = set(self.speakers) - snapshot_addresses
        for address in evicted:
            _LOGGER.debug("Evicting speaker %s (no longer present in bridge snapshot)", address)
            del self.speakers[address]
            for listener in tuple(self._update_listeners):
                listener(address)
        _LOGGER.debug(
            "Speakers snapshot refreshed: %d active speakers (%s)",
            len(self.speakers),
            list(self.speakers.keys()),
        )

    async def async_command(self, address: str, operation: str, **options: Any) -> dict[str, Any]:
        """Submit a native command and cache its authoritative acknowledgement."""
        normalized = normalize_address(address)
        if normalized is None:
            raise aiohttp.ClientError("Invalid Bluetooth address")
        payload = {PAYLOAD_VERSION_KEY: COMMAND_VERSION, PAYLOAD_OPERATION_KEY: operation, **{key: value for key, value in options.items() if value is not None}}
        log_address = _redacted_address(normalized)
        started = monotonic()
        _LOGGER.debug("Sending command '%s' to %s", operation, log_address)
        session = async_get_clientsession(self.hass)
        async with session.post(
            f"{self.endpoint}{NATIVE_API_PATH}/speakers/{normalized}/command",
            headers=self._headers,
            json=payload,
            timeout=_COMMAND_TIMEOUT,
        ) as response:
            body = await response.json(content_type=None)
            if response.status != HTTPStatus.OK:
                _LOGGER.warning(
                    "Command '%s' to %s failed (HTTP %s) after %.1fs: %s",
                    operation,
                    log_address,
                    response.status,
                    monotonic() - started,
                    body.get(PAYLOAD_DETAIL_KEY, "unknown error") if isinstance(body, dict) else "invalid response",
                )
                raise self._response_error(response.status, body, "BL-HAOS command failed")
        _LOGGER.info("Command '%s' to %s completed in %.1fs", operation, log_address, monotonic() - started)
        self._async_process_speaker(body)
        if normalized not in self.speakers:
            # The bridge ack rejected the record (e.g. the speaker dropped its
            # connection mid-command, so it no longer passes the trusted-sink
            # filter). Surface that as a clean transport error instead of a
            # bare KeyError from the cache lookup.
            raise aiohttp.ClientError("Speaker is no longer a trusted audio sink")
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

    def _async_process_speaker(self, speaker: Any) -> str | None:
        if not isinstance(speaker, dict):
            return None
        is_audio = speaker.get(PAYLOAD_IS_AUDIO_SINK_KEY, True)
        is_valid_sink = bool(speaker.get(PAYLOAD_TRUSTED_KEY) or speaker.get(PAYLOAD_PAIRED_KEY) or speaker.get(PAYLOAD_CONNECTED_KEY) or speaker.get(PAYLOAD_AVAILABLE_KEY))
        if not (is_audio and is_valid_sink):
            return None
        address = normalize_address(str(speaker.get(PAYLOAD_ADDRESS_KEY, "")))
        if address is None:
            return None
        normalized_speaker = {**speaker, PAYLOAD_ADDRESS_KEY: address}
        if self.speakers.get(address) == normalized_speaker:
            return address
        _LOGGER.debug(
            "Updating cached speaker %s: connected=%s, state=%s, volume=%s",
            address,
            normalized_speaker.get(PAYLOAD_CONNECTED_KEY),
            normalized_speaker.get(PAYLOAD_PLAYBACK_KEY, {}).get(PAYLOAD_STATE_KEY),
            normalized_speaker.get(PAYLOAD_PLAYBACK_KEY, {}).get(PAYLOAD_VOLUME_KEY),
        )
        self.speakers[address] = normalized_speaker
        for listener in tuple(self._update_listeners):
            listener(address)
        return address

    @staticmethod
    def _utc_now() -> str:
        return datetime.now(timezone.utc).isoformat(timespec="seconds")

    @staticmethod
    def _describe_stream_failure(failure: BaseException | None) -> tuple[str, str]:
        """Return ``(category, human detail)`` for a dropped event stream.

        The category is what diagnostics store: a raw aiohttp message carries the
        endpoint and adds nothing an operator can act on. In practice a refused
        connection means the add-on is stopped, restarting, or being updated, and
        a closed stream means the add-on went away mid-connection.
        """
        if failure is None:
            return "stream-closed", "the add-on closed the event stream (restarting or updated)"
        if AUTH_FAILURE_MARKER in str(failure).lower():
            return "credential-rejected", "the native bridge rejected the stored credential"
        if isinstance(failure, aiohttp.ClientConnectionError):
            # ClientConnectorError (refused/DNS) and ServerDisconnectedError both
            # mean the add-on went away.
            return "bridge-unreachable", "the add-on is not reachable (stopped, restarting, or updating)"
        if isinstance(failure, asyncio.TimeoutError):
            return "stream-timeout", "the add-on did not answer in time"
        if isinstance(failure, aiohttp.ClientError):
            return type(failure).__name__, f"the event stream failed ({type(failure).__name__})"
        return type(failure).__name__, f"the event stream sent an unexpected payload ({failure})"

    def _async_stream_connected(self) -> None:
        """Record a healthy stream and report the end of an outage."""
        attempts = self.consecutive_failures
        self.auth_failed = False
        if attempts:
            downtime: float | None = None
            if self._outage_started is not None:
                downtime = monotonic() - self._outage_started
                self.last_outage_seconds = round(downtime, 1)
            self.stream_reconnects += 1
            self.last_recovery_at = self._utc_now()
            _LOGGER.info(
                "BL-HAOS event stream restored after %d failed attempt(s)%s.",
                attempts,
                f" ({downtime:.1f}s unreachable)" if downtime is not None else "",
            )
        self.consecutive_failures = 0
        self._outage_started = None
        _LOGGER.debug("Native WebSocket event stream connected successfully")
        self._set_transport_available(True)

    def _async_stream_disconnected(self, failure: BaseException | None) -> None:
        """Record one stream failure, reporting an outage once instead of per retry."""
        category, detail = self._describe_stream_failure(failure)
        self.stream_failed_attempts += 1
        self.consecutive_failures += 1
        if self._outage_started is None:
            # First failure of this outage: count the outage, not each retry.
            self.stream_outages += 1
            self._outage_started = monotonic()
        self.last_disconnect_reason = category
        self.last_disconnect_at = self._utc_now()
        self._set_transport_available(False)

        if category == "credential-rejected":
            # Rotated/invalid token: retrying with the same credential only
            # hammers the bridge; park the transport so entities report
            # unavailable and diagnostics can show the cause.
            self.auth_failed = True
            _LOGGER.error("BL-HAOS credential rejected; stop retrying until the entry is reloaded")
            return

        if self.consecutive_failures == 1:
            _LOGGER.warning(
                "BL-HAOS event stream unavailable: %s. Retrying every %ds up to %ds.",
                detail,
                STREAM_RECONNECT_BASE_DELAY,
                STREAM_RECONNECT_MAX_DELAY,
            )
        else:
            _LOGGER.debug(
                "BL-HAOS event stream still unavailable (attempt %d): %s",
                self.consecutive_failures,
                detail,
            )

    async def _async_listen(self) -> None:
        """Reconnect to the native event stream until the entry is unloaded."""
        parsed = urlsplit(self.endpoint)
        websocket_scheme = "wss" if parsed.scheme == "https" else "ws"
        websocket_url = urlunsplit((websocket_scheme, parsed.netloc, WEBSOCKET_NATIVE_PATH, "", ""))
        delay = STREAM_RECONNECT_BASE_DELAY
        session = async_get_clientsession(self.hass)
        while not self._closed:
            failure: BaseException | None = None
            try:
                _LOGGER.debug("Connecting to native WebSocket event stream at %s", websocket_url)
                async with session.ws_connect(websocket_url, headers=self._headers, heartbeat=WEBSOCKET_HEARTBEAT_SECONDS) as websocket:
                    delay = STREAM_RECONNECT_BASE_DELAY
                    await self._async_refresh_snapshot(session)
                    self._async_stream_connected()
                    async for message in websocket:
                        if message.type == aiohttp.WSMsgType.TEXT:
                            payload = message.json()
                            if not isinstance(payload, dict):
                                raise ValueError("Invalid BL-HAOS native event")
                            if payload.get(PAYLOAD_EVENT_KEY) == EVENT_SPEAKER_UPDATED:
                                _LOGGER.debug("Received native speaker update event: %s", payload)
                                address = self._async_process_speaker(payload.get(PAYLOAD_DATA_KEY))
                                self._async_evict_if_rejected(payload.get(PAYLOAD_DATA_KEY), address)
                # The stream ended without raising: the add-on closed it, which is
                # what an add-on restart or update looks like from here.
            except (aiohttp.ClientError, asyncio.TimeoutError, ValueError) as err:
                failure = err

            if self._closed:
                # The entry is unloading; the stream ending is not an outage.
                return
            self._async_stream_disconnected(failure)
            if self.auth_failed:
                return
            _LOGGER.debug("Scheduling native WebSocket reconnect in %ds...", delay)
            await asyncio.sleep(delay)
            delay = min(delay * 2, STREAM_RECONNECT_MAX_DELAY)

    def _async_evict_if_rejected(self, speaker: Any, processed_address: str | None) -> None:
        """Drop a cached speaker when a live event rejects its record.

        Snapshot refresh already evicts; this covers events so a speaker that
        turns non-sink/untrusted does not linger until the next reconnect.
        """
        if processed_address is not None or not isinstance(speaker, dict):
            return
        address = normalize_address(str(speaker.get(PAYLOAD_ADDRESS_KEY, "")))
        if address is None or address not in self.speakers:
            return
        _LOGGER.debug("Evicting speaker %s (live event no longer matches the trusted-sink filter)", address)
        del self.speakers[address]
        for listener in tuple(self._update_listeners):
            listener(address)

    def _set_transport_available(self, available: bool) -> None:
        if self.transport_available == available:
            return
        _LOGGER.debug("BL-HAOS transport availability changed to %s", available)
        self.transport_available = available
        for listener in tuple(self._update_listeners):
            for address in self.speakers:
                listener(address)

    async def async_close(self) -> None:
        """Stop the event listener and discard entry-local callbacks."""
        _LOGGER.debug("Closing BL-HAOS client for %s", self.endpoint)
        self._closed = True
        if self._websocket_task:
            self._websocket_task.cancel()
            await asyncio.gather(self._websocket_task, return_exceptions=True)
            self._websocket_task = None
        self._update_listeners.clear()