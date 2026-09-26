"""Windows-safe unit coverage for BLHAOSClient command paths and reconnect logic.

These tests close the command-path validation gap recorded in
.planning/phases/20-release-quality-gates-go-live/20-REVIEW.md: the SIL fake
session used to reject every POST, so command payloads and response handling
were never exercised. They run without the Home Assistant runtime by using the
ha_stubs package (see unit/conftest.py).
"""

from __future__ import annotations

import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock

import aiohttp
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from custom_components.bl_haos.client import BLHAOSClient  # noqa: E402
from custom_components.bl_haos.const import CONNECTION_DROPPED_MARKER  # noqa: E402
from tests.conftest import FakeSession, load_snapshot  # noqa: E402

ENDPOINT = "http://bl-haos:8099"
TOKEN = "unit-test-token"
COMMAND_URL = f"{ENDPOINT}/api/native/speakers/aa:bb:cc:dd:ee:01/command"


def _client(session: FakeSession) -> tuple[BLHAOSClient, object]:
    hass = SimpleNamespace(
        data={"bl_haos_test_session": session},
        async_create_task=AsyncMock(),
        async_create_background_task=AsyncMock(),
        async_block_till_done=AsyncMock(),
    )
    return BLHAOSClient(hass, ENDPOINT, TOKEN), hass


def _stub_loop_task(client: BLHAOSClient) -> None:
    """Prevent async_initialize from starting a real listener task.

    The stub is synchronous on purpose: an ``async def`` stub would return a
    coroutine nobody awaits, and the listener coroutine it receives would never be
    closed - two "coroutine was never awaited" leaks per call.
    """

    def no_task(coro, name=None):
        coro.close()
        return AsyncMock()

    client.hass.async_create_background_task = no_task
    client.hass.async_create_task = no_task


async def test_command_payload_shape_and_cache_update():
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client, _ = _client(session)
    session.command_response = load_snapshot("speakers_initial.json")["speakers"]["aa:bb:cc:dd:ee:01"]

    await client.async_command("AA-BB-CC-DD-EE-01", "play_media", url="https://example.test/a.mp3", media_type="audio/mpeg")

    assert len(session.commands) == 1
    url, payload = session.commands[0]
    assert url == COMMAND_URL
    assert payload["version"] == 1
    assert payload["operation"] == "play_media"
    assert payload["url"] == "https://example.test/a.mp3"
    assert payload["media_type"] == "audio/mpeg"
    assert "aa:bb:cc:dd:ee:01" in client.speakers


async def test_command_error_detail_is_surfaced():
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client, _ = _client(session)
    session.command_response = {"detail": "Connected Bluetooth audio sink is unavailable"}
    session.command_status = 409

    with pytest.raises(aiohttp.ClientError, match="Connected Bluetooth audio sink is unavailable"):
        await client.async_command("aa:bb:cc:dd:ee:01", "play")


async def test_command_non_dict_body_does_not_crash():
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client, _ = _client(session)
    session.command_response = {"detail": "Native playback command failed"}
    session.command_status = 409

    with pytest.raises(aiohttp.ClientError):
        await client.async_command("aa:bb:cc:dd:ee:01", "pause")


async def test_command_invalid_address_is_rejected_locally():
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client, _ = _client(session)

    with pytest.raises(aiohttp.ClientError, match="Invalid Bluetooth address"):
        await client.async_command("not-a-mac", "play")
    assert session.commands == []


async def test_listener_cache_updated_after_command():
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client, _ = _client(session)
    speaker_record = load_snapshot("speakers_initial.json")["speakers"]["aa:bb:cc:dd:ee:01"]
    session.command_response = {**speaker_record, "connected": False}
    seen = []
    client.async_add_listener(seen.append)

    await client.async_command("aa:bb:cc:dd:ee:01", "stop")

    assert seen == ["aa:bb:cc:dd:ee:01"]
    assert client.speakers["aa:bb:cc:dd:ee:01"]["connected"] is False


async def test_process_speaker_rejects_non_sink_records():
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client, _ = _client(session)
    fresh = FakeSession(load_snapshot("speakers_initial.json"))
    fresh.speakers = {"speakers": {}}
    await client._async_refresh_snapshot(fresh)

    rejected = {**load_snapshot("speakers_initial.json")["speakers"]["aa:bb:cc:dd:ee:01"], "is_audio_sink": False}
    assert client._async_process_speaker(rejected) is None
    assert "aa:bb:cc:dd:ee:01" not in client.speakers


async def test_malformed_snapshot_is_rejected_unit():
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client, _ = _client(session)
    session.speakers = {"speakers": []}

    with pytest.raises(ValueError, match="Invalid BL-HAOS speakers snapshot"):
        await client._async_refresh_snapshot(session)


async def test_command_ack_rejected_record_raises_clean_error():
    """Regression (C1): a 200 ack whose record fails the sink filter must not KeyError."""
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client, _ = _client(session)
    # Ack for a disconnected, untrusted, non-sink record (mid-command disconnect).
    session.command_response = {
        "address": "aa:bb:cc:dd:ee:01",
        "name": "Kitchen Speaker",
        "available": False,
        "connected": False,
        "trusted": False,
        "is_audio_sink": False,
    }

    with pytest.raises(aiohttp.ClientError, match="no longer a trusted audio sink"):
        await client.async_command("aa:bb:cc:dd:ee:01", "pause")


async def test_command_401_surfaces_authentication_error():
    """Regression (H2): token rejection must be recognizable for reauth handling."""
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client, _ = _client(session)
    session.command_response = {"detail": "Native bridge authentication required"}
    session.command_status = 401

    with pytest.raises(aiohttp.ClientError, match="authentication failed"):
        await client.async_command("aa:bb:cc:dd:ee:01", "pause")
    assert client.auth_failed is False  # only the listener parks the transport


async def test_identity_non_dict_body_raises_clean_error():
    """Regression (C2/M7): a proxy error page on /identity must not AttributeError."""
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client, _ = _client(session)
    session.identity = ["unexpected"]

    with pytest.raises(aiohttp.ClientError, match="Unexpected BL-HAOS native bridge identity"):
        await client.async_initialize()


async def test_snapshot_non_dict_body_raises_clean_error():
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client, _ = _client(session)
    session.speakers = {"speakers": {}}  # valid container
    # Simulate the speakers endpoint returning a list body via a bogus shape.
    session.speakers = ["unexpected"]

    with pytest.raises(ValueError, match="Invalid BL-HAOS speakers snapshot"):
        await client._async_refresh_snapshot(session)


async def test_listener_evicts_rejected_live_event():
    """Regression (M1): a live event that rejects the record must evict the cache."""
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client, _ = _client(session)
    await client._async_refresh_snapshot(session)
    assert "aa:bb:cc:dd:ee:01" in client.speakers

    rejected = {**load_snapshot("speakers_initial.json")["speakers"]["aa:bb:cc:dd:ee:01"], "is_audio_sink": False}
    client._async_evict_if_rejected(rejected, None)

    assert "aa:bb:cc:dd:ee:01" not in client.speakers


async def test_listener_keeps_accepted_live_event():
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client, _ = _client(session)
    await client._async_refresh_snapshot(session)

    accepted = load_snapshot("speakers_initial.json")["speakers"]["aa:bb:cc:dd:ee:01"]
    address = client._async_process_speaker(accepted)
    client._async_evict_if_rejected(accepted, address)

    assert "aa:bb:cc:dd:ee:01" in client.speakers


async def test_command_retries_once_when_the_bridge_closes_the_connection():
    """A pooled socket the add-on closed must not fail the user's action.

    The daemon drops idle keep-alive connections; a command written to one of
    those sockets raised ServerDisconnectedError, which surfaced in Home
    Assistant as "Failed to play_media: Server disconnected".
    """
    snapshot = load_snapshot("speakers_initial.json")
    session = FakeSession(snapshot)
    client, _ = _client(session)
    session.command_response = snapshot["speakers"]["aa:bb:cc:dd:ee:01"]
    attempts = {"count": 0}
    served_post = session.post

    def drop_first_connection(url, **kwargs):
        attempts["count"] += 1
        if attempts["count"] == 1:
            raise aiohttp.ServerDisconnectedError()
        return served_post(url, **kwargs)

    session.post = drop_first_connection  # type: ignore[assignment]

    record = await client.async_command("aa:bb:cc:dd:ee:01", "play_media", url="https://example.test/a.mp3")

    assert attempts["count"] == 2, "a dropped connection must be retried once"
    assert len(session.commands) == 1, "only the served attempt reaches the bridge"
    assert record["address"] == "aa:bb:cc:dd:ee:01"


async def test_command_reports_a_persistent_connection_drop():
    """Two drops in a row must surface the actionable marker, not a bare message."""
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client, _ = _client(session)
    session.command_response = aiohttp.ServerDisconnectedError()
    attempts = {"count": 0}
    served_post = session.post

    def always_drop(url, **kwargs):
        attempts["count"] += 1
        return served_post(url, **kwargs)

    session.post = always_drop  # type: ignore[assignment]

    with pytest.raises(aiohttp.ClientError) as failure:
        await client.async_command("aa:bb:cc:dd:ee:01", "play")

    assert attempts["count"] == 2
    assert CONNECTION_DROPPED_MARKER in str(failure.value)


