"""In-process Home Assistant SIL coverage for saved playlist persistence."""

from __future__ import annotations

from unittest.mock import patch

import pytest
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.bl_haos.const import CONF_ENDPOINT, CONF_TOKEN, DOMAIN
from conftest import FakeSession, load_snapshot

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")

ENDPOINT = "http://bl-haos:8099"
TOKEN = "sil-test-token"


async def _setup_entry(hass, session: FakeSession) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        data={CONF_ENDPOINT: ENDPOINT, CONF_TOKEN: TOKEN},
        title="BL-HAOS Bluetooth Audio",
        unique_id="bl_haos_native_bridge",
    )
    entry.add_to_hass(hass)
    with (
        patch("custom_components.bl_haos.client.async_get_clientsession", return_value=session),
        patch("custom_components.bl_haos.config_flow.async_get_clientsession", return_value=session),
    ):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    return entry


async def test_playlist_library_create_list_through_authenticated_websocket(
    hass, bridge_session, hass_ws_client, socket_enabled
):
    """An authenticated HA user can create an empty playlist through the shared library."""
    await async_setup_component(hass, "websocket_api", {})
    await _setup_entry(hass, bridge_session)

    record_id = "c3f8941d-7e2b-4a11-8b3f-5c6d7e8f9012"
    async with await hass_ws_client() as websocket:
        await websocket.send_json_auto_id({"type": "bl_haos/playlist_library/list"})
        listed = await websocket.receive_json()
        assert listed["success"] is True
        assert listed["result"] == {"revision": 0, "records": []}

        create = {
            "type": "bl_haos/playlist_library/save_custom",
            "record_id": record_id,
            "name": "Quiet hours",
            "entries": [],
            "revision": 0,
        }
        await websocket.send_json_auto_id(create)
        created = await websocket.receive_json()
        assert created["success"] is True
        assert created["result"]["records"] == [
            {"record_id": record_id, "kind": "custom", "name": "Quiet hours", "entries": []}
        ]

        await websocket.send_json_auto_id(create)
        retried = await websocket.receive_json()
        assert retried["success"] is True
        assert len(retried["result"]["records"]) == 1
        assert retried["result"]["records"][0]["record_id"] == record_id
        assert retried["result"]["records"][0]["entries"] == []