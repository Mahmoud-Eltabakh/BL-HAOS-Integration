"""Shared fixtures for Home Assistant integration SIL tests."""

from __future__ import annotations

import asyncio
import json
import os
import sys
from pathlib import Path
from typing import Any

import aiohttp
import pytest

FIXTURE_DIR = Path(__file__).parent / "fixtures"


def pytest_ignore_collect(collection_path: Path, config) -> bool | None:
    """Skip Home Assistant SIL tests where the HA runtime cannot import.

    Home Assistant Core imports Unix-only modules (fcntl) at import time, so the
    SIL suite can only run on Linux (CI or WSL2). Developers can override with
    BLHAOS_RUN_SIL=1 when running inside such an environment. The package-layout
    and unit tests always run everywhere.
    """
    if collection_path.name != "test_ha_integration_sil.py":
        return None
    if sys.platform != "win32":
        return None
    if os.environ.get("BLHAOS_RUN_SIL") == "1":
        return None
    return True


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
        self.commands: list[tuple[str, dict[str, Any]]] = []
        self.command_response: dict[str, Any] | Exception | tuple[dict[str, Any], int] = {}
        self.command_status: int = 200

    def get(self, url: str, **kwargs: Any) -> FakeResponse:
        if url.endswith("/identity"):
            return FakeResponse(self.identity)
        if url.endswith("/speakers"):
            return FakeResponse(self.speakers)
        raise AssertionError(f"Unexpected SIL GET: {url}")

    def post(self, url: str, **kwargs: Any) -> FakeResponse:
        """Record the command payload and reply with the configured response."""
        payload = kwargs.get("json")
        self.commands.append((url, payload if isinstance(payload, dict) else {}))
        response = self.command_response
        if isinstance(response, Exception):
            raise response
        if isinstance(response, tuple):
            body, status = response
            return FakeResponse(body, status=status)
        return FakeResponse(response, status=self.command_status)

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