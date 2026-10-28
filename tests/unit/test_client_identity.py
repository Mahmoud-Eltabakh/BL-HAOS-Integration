"""The native token must never reach an endpoint that is not a BL-HAOS bridge.

The endpoint arrives from Supervisor discovery or from a stored config entry, so
an add-on that disappears - or a mistyped host - can leave the integration
pointed at a host it does not control. The identity request used to be the first
thing the client sent, with the bearer token already attached, which handed the
credential to whoever answered. See THREAT-MODEL.md, T4.
"""

from __future__ import annotations

import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock

import aiohttp
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from custom_components.bl_haos.client import BLHAOSClient, IncompatibleBridgeError  # noqa: E402
from custom_components.bl_haos.compatibility import evaluate_identity  # noqa: E402
import custom_components.bl_haos.client as client_module  # noqa: E402
from tests.conftest import FakeSession, load_snapshot  # noqa: E402

ENDPOINT = "http://bl-haos:8099"
TOKEN = "unit-test-token"


def _client(session: FakeSession) -> BLHAOSClient:
    hass = SimpleNamespace(
        data={"bl_haos_test_session": session},
        async_create_task=AsyncMock(),
        async_create_background_task=AsyncMock(),
        async_block_till_done=AsyncMock(),
    )

    def no_task(coro, name=None):
        """Close the listener coroutine instead of scheduling it.

        Synchronous on purpose: an ``async def`` stub returns a coroutine nobody
        awaits, and leaves the listener coroutine it was handed unclosed.
        """
        coro.close()
        return AsyncMock()

    hass.async_create_background_task = no_task
    hass.async_create_task = no_task
    return BLHAOSClient(hass, ENDPOINT, TOKEN)


async def test_initialize_never_presents_the_token_to_a_non_bridge_endpoint():
    session = FakeSession(load_snapshot("speakers_initial.json"))
    session.health = {"status": "ok", "service": "Some Other Addon"}
    client = _client(session)

    with pytest.raises(aiohttp.ClientError, match="did not identify as a BL-HAOS bridge"):
        await client.async_initialize()

    assert [url for url, _ in session.get_calls] == [f"{ENDPOINT}/api/health"]
    assert all("headers" not in kwargs for _, kwargs in session.get_calls)


async def test_initialize_checks_identity_before_sending_credentials():
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client = _client(session)

    await client.async_initialize()

    urls = [url for url, _ in session.get_calls]
    assert urls[0] == f"{ENDPOINT}/api/health"
    assert urls[1] == f"{ENDPOINT}/api/native/identity"
    # The pre-flight carries no credential; it appears only after the endpoint has
    # introduced itself as the bridge.
    assert "headers" not in session.get_calls[0][1]
    assert session.get_calls[1][1]["headers"]["Authorization"] == f"Bearer {TOKEN}"
    assert client.transport_available is True


async def test_known_mismatch_stops_before_snapshot_and_websocket(monkeypatch):
    session = FakeSession(load_snapshot("speakers_initial.json"))
    session.identity.update({"addon_version": "0.2.69", "min_integration_version": "0.2.22"})
    client = _client(session)
    result = evaluate_identity(session.identity, "0.2.22")

    async def evaluate(_hass, _identity):
        return result

    monkeypatch.setattr(client_module, "evaluate_bridge_identity", evaluate)
    with pytest.raises(IncompatibleBridgeError, match="compatibility check failed"):
        await client.async_initialize()

    assert [url for url, _ in session.get_calls] == [
        f"{ENDPOINT}/api/health", f"{ENDPOINT}/api/native/identity",
    ]
    assert client.compatibility["status"] == "incompatible"
    assert session.last_ws_url is None
    assert session.commands == []


async def test_known_mismatch_blocks_command_and_management_requests():
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client = _client(session)
    client.compatibility = evaluate_identity(
        {"bridge_id": "bl_haos_native_bridge", "version": 2}, "0.2.22"
    ).as_dict()

    with pytest.raises(IncompatibleBridgeError):
        await client.async_command("10:22:33:44:55:66", "stop")
    with pytest.raises(IncompatibleBridgeError):
        await client.async_scan(True)
    assert session.commands == []
    assert session.management_calls == []
