"""Shared fixtures for Home Assistant integration SIL tests."""

from __future__ import annotations

import asyncio
import json
from pathlib import Path
from typing import Any

import aiohttp
import pytest

FIXTURE_DIR = Path(__file__).parent / "fixtures"


class FakeResponse:
    """Minimal aiohttp response context manager for the native client."""

    def __init__(self, payload: dict[str, Any], status: int = 200) -> None:
        self.status = status
        self._payload = payload

    async def __aenter__(self) -> "FakeResponse":
        return self

    async def __aexit__(self, *args: Any) -> None:
        return None

    async def json(self) -> dict[str, Any]:
        return self._payload


class FakeWebSocket:
    """A controllable websocket transport that emits no unsolicited events."""

    def __init__(self, available: bool, messages: list[Any] | None = None) -> None:
        self.available = available
        self.messages = messages or []

    async def __aenter__(self) -> "FakeWebSocket":
        if not self.available:
            raise aiohttp.ClientError("SIL websocket transport is intentionally offline")
        return self

    async def __aexit__(self, *args: Any) -> None:
        return None

    def __aiter__(self) -> "FakeWebSocket":
        return self

    async def __anext__(self) -> Any:
        if self.messages:
            return self.messages.pop(0)
        await asyncio.Future()


class FakeSession:
    """Serve fixture payloads through the aiohttp session methods the client uses."""

    def __init__(self, speakers: dict[str, Any]) -> None:
        self.speakers = speakers
        self.identity = {"bridge_id": "bl_haos_native_bridge", "version": 1}
        self.websocket_available = True
        self.websocket_messages: list[Any] = []
        self.last_ws_url: str | None = None

    def get(self, url: str, **kwargs: Any) -> FakeResponse:
        if url.endswith("/identity"):
            return FakeResponse(self.identity)
        if url.endswith("/speakers"):
            return FakeResponse(self.speakers)
        raise AssertionError(f"Unexpected SIL GET: {url}")

    def post(self, url: str, **kwargs: Any) -> FakeResponse:
        raise AssertionError(f"Unexpected SIL POST: {url}")

    def ws_connect(self, url: str, **kwargs: Any) -> FakeWebSocket:
        self.last_ws_url = url
        return FakeWebSocket(self.websocket_available, self.websocket_messages)


def load_snapshot(name: str) -> dict[str, Any]:
    """Load a checked-in authoritative bridge snapshot."""
    return json.loads((FIXTURE_DIR / name).read_text(encoding="utf-8"))


@pytest.fixture
def bridge_session() -> FakeSession:
    """Return a mutable session seeded with the initial bridge snapshot."""
    return FakeSession(load_snapshot("speakers_initial.json"))