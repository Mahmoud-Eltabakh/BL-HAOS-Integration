"""In-process Home Assistant SIL coverage for the BL-HAOS integration."""

from __future__ import annotations

import os
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import aiohttp
import pytest
from homeassistant import config_entries
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.bl_haos.const import CONF_ENDPOINT, CONF_LOG_LEVEL, CONF_TOKEN, DOMAIN
from custom_components.bl_haos.client import BLHAOSClient
from custom_components.bl_haos.diagnostics import async_get_config_entry_diagnostics

from conftest import FakeSession, load_snapshot

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")

ENDPOINT = "http://bl-haos:8099"
TOKEN = "sil-test-token"


def _patch_session(session: FakeSession):
    """Patch both integration modules so no real aiohttp session is used."""
    return (
        patch("custom_components.bl_haos.client.async_get_clientsession", return_value=session),
        patch("custom_components.bl_haos.config_flow.async_get_clientsession", return_value=session),
    )


async def _setup_entry(hass, session: FakeSession) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        data={CONF_ENDPOINT: ENDPOINT, CONF_TOKEN: TOKEN},
        title="BL-HAOS Bluetooth Audio",
        unique_id="bl_haos_native_bridge",
    )
    entry.add_to_hass(hass)
    client_patch, flow_patch = _patch_session(session)
    with client_patch, flow_patch:
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    return entry


def _media_players(hass) -> dict[str, object]:
    return {state.entity_id: state for state in hass.states.async_all("media_player")}


async def test_snapshot_creation_loads_authoritative_speakers(hass, bridge_session):
    entry = await _setup_entry(hass, bridge_session)
    states = _media_players(hass)

    assert len(states) == 2
    assert {state.name for state in states.values()} == {"Kitchen Speaker", "Office Speaker"}
    registry = er.async_get(hass)
    entities = {item.unique_id: item for item in registry.entities.values() if item.platform == DOMAIN}
    assert set(entities) == {
        "bl_haos_aabbccddee01",
        "bl_haos_aabbccddee02",
    }
    assert all(hass.states.get(item.entity_id).state != "unavailable" for item in entities.values())
    assert entry.runtime_data.client.token == TOKEN


async def test_snapshot_eviction_removes_stale_entity_and_keeps_remaining(hass, bridge_session):
    entry = await _setup_entry(hass, bridge_session)
    client = entry.runtime_data.client
    bridge_session.speakers = load_snapshot("speakers_after_eviction.json")

    await client._async_refresh_snapshot(bridge_session)
    await hass.async_block_till_done()

    states = _media_players(hass)
    assert set(states) == {"media_player.kitchen_speaker"}
    assert "aa:bb:cc:dd:ee:02" not in client.speakers
    assert states["media_player.kitchen_speaker"].state == "playing"
    registry = er.async_get(hass)
    assert registry.async_get("media_player.kitchen_speaker").unique_id == "bl_haos_aabbccddee01"

    await client._async_refresh_snapshot(bridge_session)
    await hass.async_block_till_done()
    assert set(_media_players(hass)) == {"media_player.kitchen_speaker"}


async def test_config_flow_accepts_identity_and_rejects_bad_connection(hass, bridge_session):
    client_patch, flow_patch = _patch_session(bridge_session)
    with client_patch, flow_patch:
        result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
        assert result["type"] == "form"
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], user_input={CONF_ENDPOINT: "https://bad.example/path", CONF_TOKEN: TOKEN}
        )
    assert result["type"] == "form"
    assert result["errors"] == {"base": "cannot_connect"}
    hass.config_entries.flow.async_abort(result["flow_id"])

    bridge_session.identity = {"bridge_id": "unexpected"}
    with client_patch, flow_patch:
        result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], user_input={CONF_ENDPOINT: "bl-haos", CONF_TOKEN: TOKEN}
        )
    assert result["type"] == "form"
    assert result["errors"] == {"base": "cannot_connect"}
    hass.config_entries.flow.async_abort(result["flow_id"])

    bridge_session.identity = {"bridge_id": "bl_haos_native_bridge", "version": 1}
    with client_patch, flow_patch:
        result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], user_input={CONF_ENDPOINT: "bl-haos", CONF_TOKEN: TOKEN}
        )
    assert result["type"] == "create_entry"
    assert result["data"] == {CONF_ENDPOINT: ENDPOINT, CONF_TOKEN: TOKEN}


async def test_hassio_discovery_with_token_auto_creates_entry(hass, bridge_session):
    from homeassistant.helpers.service_info.hassio import HassioServiceInfo

    bridge_session.identity = {"bridge_id": "bl_haos_native_bridge", "version": 1}
    client_patch, flow_patch = _patch_session(bridge_session)
    discovery_info = HassioServiceInfo(
        config={"token": TOKEN, CONF_LOG_LEVEL: "debug"}, name="BL-HAOS", slug="c839f4a9_bl_haos", uuid="uuid"
    )
    with client_patch, flow_patch:
        result = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": config_entries.SOURCE_HASSIO}, data=discovery_info
        )
    assert result["type"] == "create_entry"
    assert result["data"] == {
        CONF_ENDPOINT: "http://c839f4a9-bl-haos:8099",
        CONF_TOKEN: TOKEN,
        CONF_LOG_LEVEL: "debug",
    }


async def test_hassio_discovery_refreshes_existing_entry_credentials(hass, bridge_session):
    from homeassistant.helpers.service_info.hassio import HassioServiceInfo

    entry = MockConfigEntry(
        domain=DOMAIN,
        data={CONF_ENDPOINT: "http://old-bridge:8099", CONF_TOKEN: "stale-token"},
        title="BL-HAOS Bluetooth Audio",
        unique_id="bl_haos_native_bridge",
    )
    entry.add_to_hass(hass)
    discovery_info = HassioServiceInfo(
        config={"token": TOKEN, CONF_LOG_LEVEL: "debug"}, name="BL-HAOS", slug="c839f4a9_bl_haos", uuid="uuid"
    )
    client_patch, flow_patch = _patch_session(bridge_session)

    with client_patch, flow_patch:
        result = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": config_entries.SOURCE_HASSIO}, data=discovery_info
        )

    assert result["type"] == "abort"
    updated_entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert updated_entry is not None
    assert updated_entry.data == {
        CONF_ENDPOINT: "http://c839f4a9-bl-haos:8099",
        CONF_TOKEN: TOKEN,
        CONF_LOG_LEVEL: "debug",
    }


async def test_hassio_discovery_without_token_falls_back_to_manual_prompt(hass, bridge_session):
    from homeassistant.helpers.service_info.hassio import HassioServiceInfo

    client_patch, flow_patch = _patch_session(bridge_session)
    discovery_info = HassioServiceInfo(config={}, name="BL-HAOS", slug="c839f4a9_bl_haos", uuid="uuid")
    with client_patch, flow_patch:
        result = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": config_entries.SOURCE_HASSIO}, data=discovery_info
        )
        assert result["type"] == "form"
        assert result["step_id"] == "hassio_confirm"
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], user_input={CONF_TOKEN: TOKEN}
        )
    assert result["type"] == "create_entry"
    assert result["data"] == {
        CONF_ENDPOINT: "http://c839f4a9-bl-haos:8099",
        CONF_TOKEN: TOKEN,
        CONF_LOG_LEVEL: "info",
    }


async def test_websocket_failure_marks_transport_unavailable(hass, bridge_session):
    client = BLHAOSClient(hass, ENDPOINT, TOKEN)
    client.transport_available = True
    bridge_session.websocket_available = False

    async def stop_after_failure(_delay):
        client._closed = True

    with (
        patch("custom_components.bl_haos.client.async_get_clientsession", return_value=bridge_session),
        patch("custom_components.bl_haos.client.asyncio.sleep", AsyncMock(side_effect=stop_after_failure)),
    ):
        await client._async_listen()

    assert not client.transport_available


async def test_websocket_scheme_matches_endpoint(hass, bridge_session):
    for endpoint, expected in (("http://bl-haos:8099", "ws://bl-haos:8099/ws/native"), ("https://bl-haos:8099", "wss://bl-haos:8099/ws/native")):
        client = BLHAOSClient(hass, endpoint, TOKEN)
        bridge_session.websocket_available = False

        async def stop_after_failure(_delay):
            client._closed = True

        with (
            patch("custom_components.bl_haos.client.async_get_clientsession", return_value=bridge_session),
            patch("custom_components.bl_haos.client.asyncio.sleep", AsyncMock(side_effect=stop_after_failure)),
        ):
            await client._async_listen()

        assert bridge_session.last_ws_url == expected


async def test_malformed_websocket_event_reconnects(hass, bridge_session):
    client = BLHAOSClient(hass, ENDPOINT, TOKEN)
    bridge_session.websocket_messages = [
        SimpleNamespace(type=aiohttp.WSMsgType.TEXT, json=lambda: ["invalid"])
    ]

    async def stop_after_failure(_delay):
        client._closed = True

    with (
        patch("custom_components.bl_haos.client.async_get_clientsession", return_value=bridge_session),
        patch("custom_components.bl_haos.client.asyncio.sleep", AsyncMock(side_effect=stop_after_failure)),
    ):
        await client._async_listen()

    assert not client.transport_available


async def test_malformed_snapshot_is_rejected(hass, bridge_session):
    client = BLHAOSClient(hass, ENDPOINT, TOKEN)
    bridge_session.speakers = {"speakers": []}

    with pytest.raises(ValueError, match="Invalid BL-HAOS speakers snapshot"):
        await client._async_refresh_snapshot(bridge_session)


async def test_snapshot_eviction_removes_rejected_speaker(hass, bridge_session):
    client = BLHAOSClient(hass, ENDPOINT, TOKEN)
    await client._async_refresh_snapshot(bridge_session)

    bridge_session.speakers["aa:bb:cc:dd:ee:01"]["is_audio_sink"] = False
    await client._async_refresh_snapshot(bridge_session)

    assert "aa:bb:cc:dd:ee:01" not in client.speakers


async def test_unload_closes_client_and_removes_entities(hass, bridge_session):
    entry = await _setup_entry(hass, bridge_session)
    client = entry.runtime_data.client
    task = client._websocket_task

    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()

    assert not _media_players(hass)
    assert client._closed
    assert client._websocket_task is None
    assert not client._update_listeners
    assert task is not None and task.done()


async def test_diagnostics_contains_bounded_operator_contract(hass, bridge_session):
    entry = await _setup_entry(hass, bridge_session)

    payload = await async_get_config_entry_diagnostics(hass, entry)

    assert payload["contract_version"] == 1
    assert payload["support_bundle"]["schema"] == "bl-haos.support-bundle"
    assert payload["support_bundle"]["versions"] == {"diagnostics": 1, "events": 1, "health": 1}
    assert TOKEN not in str(payload)
    assert ENDPOINT not in str(payload)


async def test_media_player_supports_browsing_folders_and_media_sources(hass, bridge_session):
    from homeassistant.components.media_player import MediaPlayerEntityFeature
    from homeassistant.setup import async_setup_component

    await async_setup_component(hass, "media_source", {})
    for media_dir in hass.config.media_dirs.values():
        os.makedirs(media_dir, exist_ok=True)
    entry = await _setup_entry(hass, bridge_session)
    states = _media_players(hass)
    kitchen_entity_id = next(
        entity_id for entity_id, state in states.items() if state.name == "Kitchen Speaker"
    )

    assert states[kitchen_entity_id].attributes["supported_features"] & MediaPlayerEntityFeature.BROWSE_MEDIA

    component = hass.data["entity_components"]["media_player"]
    player = component.get_entity(kitchen_entity_id)

    browse_result = await player.async_browse_media()

    assert browse_result is not None
    assert browse_result.media_content_id is not None


async def test_media_player_ignores_resume_when_no_media_is_active(hass, bridge_session):
    entry = await _setup_entry(hass, bridge_session)
    component = hass.data["entity_components"]["media_player"]
    player = component.get_entity("media_player.kitchen_speaker")

    with patch.object(
        entry.runtime_data.client,
        "async_command",
        new=AsyncMock(side_effect=aiohttp.ClientError("No active playback to resume")),
    ):
        await player.async_media_play()