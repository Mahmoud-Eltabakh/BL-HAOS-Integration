"""In-process Home Assistant SIL coverage for the BL-HAOS integration."""

from __future__ import annotations

from unittest.mock import patch

import pytest
from homeassistant import config_entries
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.bl_haos.const import CONF_ENDPOINT, CONF_TOKEN, DOMAIN
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
        config={"token": TOKEN}, name="BL-HAOS", slug="c839f4a9_bl_haos", uuid="uuid"
    )
    with client_patch, flow_patch:
        result = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": config_entries.SOURCE_HASSIO}, data=discovery_info
        )
    assert result["type"] == "create_entry"
    assert result["data"] == {CONF_ENDPOINT: "http://c839f4a9-bl-haos:8099", CONF_TOKEN: TOKEN}


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
    assert result["data"] == {CONF_ENDPOINT: "http://c839f4a9-bl-haos:8099", CONF_TOKEN: TOKEN}


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