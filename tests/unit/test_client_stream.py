"""Windows-safe unit coverage for event-stream outage reporting.

A Supervisor add-on restart (an add-on update, a config change, a reboot) drops
the native event stream. The listener used to warn on every retry, so one restart
produced a burst of warnings in the Home Assistant log that looked like a fault.
These tests pin the intended behaviour: one warning per outage, silence while it
lasts, one line when it ends, and counters that diagnostics can report.
"""

from __future__ import annotations

import logging
import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import aiohttp
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from custom_components.bl_haos.client import BLHAOSClient  # noqa: E402
from tests.conftest import FakeSession, FakeWebSocket, load_snapshot  # noqa: E402

ENDPOINT = "http://bl-haos:8099"
TOKEN = "unit-test-token"
LOGGER_NAME = "custom_components.bl_haos.client"


class _ClosedSocket(FakeWebSocket):
    """An endpoint that accepts the connection and then closes the stream."""

    def __init__(self) -> None:
        super().__init__(available=True)

    async def __anext__(self) -> object:
        raise StopAsyncIteration


def _client(session: FakeSession) -> BLHAOSClient:
    hass = SimpleNamespace(
        data={"bl_haos_test_session": session},
        async_create_task=AsyncMock(),
        async_create_background_task=AsyncMock(),
        async_block_till_done=AsyncMock(),
    )
    return BLHAOSClient(hass, ENDPOINT, TOKEN)


def _messages(caplog: pytest.LogCaptureFixture, level: int) -> list[str]:
    return [record.getMessage() for record in caplog.records if record.levelno == level]


async def test_unreachable_addon_logs_one_warning_per_outage(caplog):
    """Twelve retries against a stopped add-on must not produce twelve warnings."""
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client = _client(session)

    def unreachable(_url, **_kwargs):
        # Mirrors the real report: "Cannot connect to host <add-on>:8099 ssl:default
        # [Connect call failed]" arrives as a client connection error.
        raise aiohttp.ClientConnectionError(
            "Cannot connect to host bl-haos:8099 ssl:default [Connect call failed ('172.30.33.1', 8099)]"
        )

    session.ws_connect = unreachable  # type: ignore[assignment]

    async def stop_after_three(_delay):
        if client.stream_failed_attempts >= 3:
            client._closed = True

    with (
        patch("custom_components.bl_haos.client.async_get_clientsession", return_value=session),
        patch("custom_components.bl_haos.client.asyncio.sleep", AsyncMock(side_effect=stop_after_three)),
        caplog.at_level(logging.DEBUG, logger=LOGGER_NAME),
    ):
        await client._async_listen()

    warnings = _messages(caplog, logging.WARNING)
    assert len(warnings) == 1, f"expected a single warning for one outage, got {warnings}"
    assert "not reachable" in warnings[0]
    assert "restarting" in warnings[0]

    # Later attempts stay at debug, and the outage is still counted accurately.
    assert any("still unavailable (attempt 2)" in message for message in _messages(caplog, logging.DEBUG))
    assert client.stream_failed_attempts == 3
    assert client.stream_outages == 1, "retries inside one outage must not inflate the outage count"
    assert client.consecutive_failures == 3
    assert client.last_disconnect_reason == "bridge-unreachable"
    assert client.transport_available is False
    assert client.last_disconnect_at is not None


async def test_stream_recovery_is_reported_once(caplog):
    """Recovery must produce one informative line, not one per reconnect attempt."""
    session = FakeSession(load_snapshot("speakers_initial.json"))
    attempts = {"n": 0}
    client = _client(session)

    def ws_connect(_url, **_kwargs):
        attempts["n"] += 1
        if attempts["n"] <= 2:
            return FakeWebSocket(available=False)
        client._closed = True
        return _ClosedSocket()

    session.ws_connect = ws_connect  # type: ignore[assignment]
    client.transport_available = True

    with (
        patch("custom_components.bl_haos.client.async_get_clientsession", return_value=session),
        patch("custom_components.bl_haos.client.asyncio.sleep", AsyncMock()),
        caplog.at_level(logging.DEBUG, logger=LOGGER_NAME),
    ):
        await client._async_listen()

    restored = _messages(caplog, logging.INFO)
    assert len(restored) == 1, f"expected one recovery line, got {restored}"
    assert "restored after 2 failed attempt(s)" in restored[0]
    assert client.stream_reconnects == 1
    assert client.consecutive_failures == 0
    assert client.last_recovery_at is not None
    assert client.last_outage_seconds is not None
    assert client.transport_available is True


async def test_clean_stream_close_is_reported_as_a_restart(caplog):
    """A stream the bridge closes is a disconnect too, and must not stay silent."""
    session = FakeSession(load_snapshot("speakers_initial.json"))
    session.ws_connect = lambda *_args, **_kwargs: _ClosedSocket()  # type: ignore[assignment]
    client = _client(session)
    client.transport_available = True

    async def stop_after_first(_delay):
        client._closed = True

    with (
        patch("custom_components.bl_haos.client.async_get_clientsession", return_value=session),
        patch("custom_components.bl_haos.client.asyncio.sleep", AsyncMock(side_effect=stop_after_first)),
        caplog.at_level(logging.DEBUG, logger=LOGGER_NAME),
    ):
        await client._async_listen()

    assert client.last_disconnect_reason == "stream-closed"
    assert client.stream_outages == 1
    assert client.transport_available is False
    warnings = _messages(caplog, logging.WARNING)
    assert len(warnings) == 1
    assert "closed the event stream" in warnings[0]


async def test_credential_rejection_parks_the_transport(caplog):
    """A rejected token must stop the loop instead of retrying forever."""
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client = _client(session)

    def rejected(_url, **_kwargs):
        raise aiohttp.ClientError(
            "BL-HAOS authentication failed (HTTP 401): Native bridge authentication required"
        )

    session.ws_connect = rejected  # type: ignore[assignment]

    with (
        patch("custom_components.bl_haos.client.async_get_clientsession", return_value=session),
        patch("custom_components.bl_haos.client.asyncio.sleep", AsyncMock()) as sleep,
        caplog.at_level(logging.DEBUG, logger=LOGGER_NAME),
    ):
        await client._async_listen()

    assert client.auth_failed is True
    assert client.last_disconnect_reason == "credential-rejected"
    assert client.transport_available is False
    assert sleep.await_count == 0, "a parked transport must not schedule another retry"
    assert len(_messages(caplog, logging.ERROR)) == 1
    assert _messages(caplog, logging.WARNING) == []
