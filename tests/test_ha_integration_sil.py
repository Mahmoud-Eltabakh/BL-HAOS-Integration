"""In-process Home Assistant SIL coverage for the BL-HAOS integration."""

from __future__ import annotations

import logging
import os
import traceback
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

from tests.conftest import FakeResponse, FakeSession, FakeWebSocket, load_snapshot

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


@pytest.mark.parametrize("failure", [None, "resolve", "http", "transport", "unexpected"])
@pytest.mark.parametrize("media_type", ["audio/mpeg", "labelhostsentinel.example/labelpathsentinel", "labeltokensentinel"])
async def test_play_media_redact_real_client_logs(hass, bridge_session, caplog, failure, media_type):
    from homeassistant.exceptions import HomeAssistantError

    sentinels = (
        "streamhostsentinel.example", "stream_path_sentinel", "querykeysentinel",
        "queryvaluesentinel", "usersentinel", "passwordsentinel", "tokensentinel",
    )
    url = (
        f"https://{sentinels[0]}/{sentinels[1]}?{sentinels[2]}={sentinels[3]}"
        f"&user={sentinels[4]}&password={sentinels[5]}&token={sentinels[6]}"
    )
    await _setup_entry(hass, bridge_session)
    player = hass.data["entity_components"]["media_player"].get_entity("media_player.kitchen_speaker")
    bridge_session.command_response = bridge_session.speakers["speakers"]["aa:bb:cc:dd:ee:01"]
    if failure == "http":
        bridge_session.command_response = ({"detail": url}, 502)
    elif failure == "transport":
        bridge_session.command_response = aiohttp.ClientError(url)
    elif failure == "unexpected":
        bridge_session.command_response = RuntimeError(url)
    resolver = AsyncMock(return_value=SimpleNamespace(url=url, mime_type=media_type))
    if failure == "resolve":
        resolver.side_effect = RuntimeError(url)
    caplog.set_level(logging.DEBUG, logger="custom_components.bl_haos")
    caplog.clear()
    error_text = ""
    with (
        patch("custom_components.bl_haos.media_player.async_resolve_media", resolver),
        patch("custom_components.bl_haos.client.async_get_clientsession", return_value=bridge_session),
    ):
        if failure:
            with pytest.raises(HomeAssistantError) as caught:
                await player.async_play_media("music", "media-source://provider/item")
            error_text = "".join(traceback.format_exception(caught.value))
        else:
            await player.async_play_media("music", "media-source://provider/item")
    if failure == "resolve":
        assert bridge_session.commands == []
    else:
        assert len(bridge_session.commands) == 1
        assert bridge_session.commands[0][1] == {
            "version": 1, "operation": "play_media", "url": url, "media_type": media_type,
        }
        assert "play_media" in caplog.text
        assert "media_player.kitchen_speaker" in caplog.text
        assert "media_type=" in caplog.text
    assert "call enter function=" in caplog.text
    for sentinel in (url, *sentinels, "labelhostsentinel", "labelpathsentinel", "labeltokensentinel"):
        assert sentinel not in caplog.text + error_text


async def test_media_player_publishes_the_playback_timeline(hass, bridge_session):
    """HA renders its progress bar from the position/duration the bridge pushes."""
    entry = await _setup_entry(hass, bridge_session)
    client = entry.runtime_data.client
    speakers = load_snapshot("speakers_initial.json")
    speakers["speakers"]["aa:bb:cc:dd:ee:01"]["playback"] = {
        "state": "playing",
        "volume": 0.42,
        "position": 12.5,
        "duration": 240.0,
        "position_updated_at": 1790300000.0,
        "title": "04.athan mishary",
        "artist": "Malek Chibat Al-Hamd",
    }
    bridge_session.speakers = speakers

    await client._async_refresh_snapshot(bridge_session)
    await hass.async_block_till_done()

    player = hass.data["entity_components"]["media_player"].get_entity("media_player.kitchen_speaker")
    assert player.media_position == 12
    assert player.media_duration == 240
    assert player.media_position_updated_at.timestamp() == 1790300000.0
    assert player.media_title == "04.athan mishary"
    assert player.media_artist == "Malek Chibat Al-Hamd"

    state = hass.states.get("media_player.kitchen_speaker")
    assert state.state == "playing"
    assert state.attributes["media_position"] == 12
    assert state.attributes["media_duration"] == 240
    assert state.attributes["media_title"] == "04.athan mishary"
    assert state.attributes["media_artist"] == "Malek Chibat Al-Hamd"


async def test_media_player_without_a_timeline_reports_no_progress(hass, bridge_session):
    """A bridge that sends no timeline must not show a misleading progress bar."""
    await _setup_entry(hass, bridge_session)

    player = hass.data["entity_components"]["media_player"].get_entity("media_player.office_speaker")
    assert player.media_position is None
    assert player.media_duration is None
    assert player.media_position_updated_at is None
    assert player.media_title is None
    assert player.media_artist is None

    state = hass.states.get("media_player.office_speaker")
    assert state.state == "playing"
    assert "media_position" not in state.attributes
    assert "media_duration" not in state.attributes
    assert "media_title" not in state.attributes


async def test_native_queue_controls_are_capability_gated_and_use_shared_snapshot(hass, bridge_session):
    from homeassistant.components.media_player import MediaPlayerEntityFeature, RepeatMode

    entry = await _setup_entry(hass, bridge_session)
    player = hass.data["entity_components"]["media_player"].get_entity("media_player.kitchen_speaker")
    queue_features = (
        MediaPlayerEntityFeature.NEXT_TRACK
        | MediaPlayerEntityFeature.PREVIOUS_TRACK
        | MediaPlayerEntityFeature.SHUFFLE_SET
        | MediaPlayerEntityFeature.REPEAT_SET
    )
    assert not player.supported_features & queue_features

    address = "aa:bb:cc:dd:ee:01"
    speaker = bridge_session.speakers["speakers"][address]
    speaker["queue_version"] = 1
    speaker["playback"]["queue"] = {
        "status": "playing",
        "playlist": "Saved queue",
        "title": "Current item",
        "index": 2,
        "count": 3,
        "shuffle": False,
        "repeat": "one",
        "url": "https://private.invalid/never-project",
    }
    entry.runtime_data.client._async_process_speaker(speaker)
    assert player.supported_features & queue_features == queue_features
    assert player.media_playlist == "Saved queue"
    assert player.shuffle is False
    assert player.repeat is RepeatMode.ONE
    assert "url" not in player.extra_state_attributes["queue"]

    bridge_session.commands.clear()
    bridge_session.command_response = speaker
    with patch("custom_components.bl_haos.client.async_get_clientsession", return_value=bridge_session):
        await player.async_media_next_track()
        await player.async_media_previous_track()
        await player.async_set_shuffle(True)
        await player.async_set_repeat(RepeatMode.ALL)

    assert [payload["operation"] for _, payload in bridge_session.commands] == [
        "next", "previous", "set_shuffle", "set_repeat",
    ]
    assert all(payload["queue_version"] == 1 for _, payload in bridge_session.commands)
    assert bridge_session.commands[2][1]["shuffle"] is True
    assert bridge_session.commands[3][1]["repeat"] == "all"


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


async def test_offline_paired_speaker_entity_is_disabled_until_it_returns(hass, bridge_session):
    """A paired speaker that is switched off has its entity disabled, not removed.

    The bridge keeps publishing a trusted speaker while it is offline, with
    ``connected: false`` and ``paired: true`` (BlueZ keeps a paired device). The
    entity must leave the state machine - so no dead card, and no automation
    target that silently fails - while keeping its identity, and it has to come
    back by itself when the speaker does, which a removed entity never could.
    """
    entry = await _setup_entry(hass, bridge_session)
    client = entry.runtime_data.client
    registry = er.async_get(hass)
    bridge_session.speakers = load_snapshot("speakers_offline.json")

    await client._async_refresh_snapshot(bridge_session)
    await hass.async_block_till_done()

    assert "aa:bb:cc:dd:ee:01" in client.speakers
    offline = registry.async_get("media_player.kitchen_speaker")
    assert offline is not None, "the entity keeps its identity while the speaker is away"
    assert offline.disabled_by == er.RegistryEntryDisabler.INTEGRATION
    assert hass.states.get("media_player.kitchen_speaker") is None
    assert hass.states.get("media_player.office_speaker").state == "playing"

    # Switched back on: the same entity is enabled again and reports its state.
    bridge_session.speakers = load_snapshot("speakers_initial.json")
    await client._async_refresh_snapshot(bridge_session)
    await hass.async_block_till_done()

    assert registry.async_get("media_player.kitchen_speaker").disabled_by is None
    assert hass.states.get("media_player.kitchen_speaker").state != "unavailable"


async def test_unpaired_speaker_entity_is_removed(hass, bridge_session):
    """Losing the pairing removes the entity completely.

    BlueZ withdraws the device object of anything it treats as temporary, which
    is every device that is not paired; the bridge reports that as
    ``detached: true``. The speaker is still trusted (the operator still owns
    it), but only a paired speaker is a media player in Home Assistant.
    """
    entry = await _setup_entry(hass, bridge_session)
    client = entry.runtime_data.client
    bridge_session.speakers = load_snapshot("speakers_unpaired.json")

    await client._async_refresh_snapshot(bridge_session)
    await hass.async_block_till_done()

    assert "aa:bb:cc:dd:ee:01" in client.speakers
    assert set(_media_players(hass)) == {"media_player.office_speaker"}
    registry = er.async_get(hass)
    assert registry.async_get("media_player.kitchen_speaker") is None
    assert registry.async_get("media_player.office_speaker").disabled_by is None


async def test_operator_disabled_entity_is_never_written_to(hass, bridge_session, caplog):
    """An entity the operator disabled is left alone, and not written to.

    Home Assistant removes a disabled entity from the platform, so a state write
    for it is an integration bug - Home Assistant reports it as
    "incorrectly being triggered for updates while it is disabled". A speaker
    update must skip it entirely and leave the operator's choice alone.
    """
    entry = await _setup_entry(hass, bridge_session)
    client = entry.runtime_data.client
    registry = er.async_get(hass)
    registry.async_update_entity(
        "media_player.kitchen_speaker", disabled_by=er.RegistryEntryDisabler.USER
    )
    await hass.async_block_till_done()

    caplog.set_level(logging.WARNING, logger="homeassistant.helpers.entity")
    bridge_session.speakers = load_snapshot("speakers_offline.json")
    await client._async_refresh_snapshot(bridge_session)
    bridge_session.speakers = load_snapshot("speakers_initial.json")
    await client._async_refresh_snapshot(bridge_session)
    await hass.async_block_till_done()

    assert registry.async_get("media_player.kitchen_speaker").disabled_by == er.RegistryEntryDisabler.USER
    assert hass.states.get("media_player.kitchen_speaker") is None
    assert "incorrectly being triggered for updates while it is disabled" not in caplog.text


async def test_paired_offline_speaker_has_no_entity_until_it_connects(hass, bridge_session):
    """A speaker that has never connected gets no entity while it is offline."""
    bridge_session.speakers = load_snapshot("speakers_offline.json")
    await _setup_entry(hass, bridge_session)

    assert set(_media_players(hass)) == {"media_player.office_speaker"}
    assert er.async_get(hass).async_get("media_player.kitchen_speaker") is None


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


async def test_native_websocket_redact_real_fallback_and_embedded_metadata(hass, bridge_session, caplog, monkeypatch):
    from pathlib import Path

    monkeypatch.syspath_prepend(str(Path(__file__).resolve().parents[2] / "bridge" / "backend"))
    from bl_haos.ha.player import MediaPlayerBridge

    address = "aa:bb:cc:dd:ee:01"
    url = "https://wshostsentinel.example/wspathsentinel.mp3?token=wstokensentinel"
    bridge = MediaPlayerBridge(sink_resolver=AsyncMock(), process_factory=AsyncMock())
    bridge._start_timeline(address, url)
    timeline = bridge.get_timeline(address)
    assert timeline["title"] == "wspathsentinel"
    embedded = {**timeline, "title": url, "artist": "wsartistsentinel " + url}
    speaker = bridge_session.speakers["speakers"][address]
    client = BLHAOSClient(hass, ENDPOINT, TOKEN)
    observed = []
    client.async_add_listener(lambda updated: observed.append(client.speakers[updated].get("playback", {}).copy()))

    class FiniteWebSocket(FakeWebSocket):
        async def __anext__(self):
            if self.messages:
                return self.messages.pop(0)
            client._closed = True
            raise StopAsyncIteration

    events = [
        {"event": "speaker_updated", "data": {**speaker, "playback": playback}}
        for playback in (timeline, embedded)
    ]
    websocket = FiniteWebSocket(True, [
        SimpleNamespace(type=aiohttp.WSMsgType.TEXT, json=lambda event=event: event)
        for event in events
    ])
    caplog.set_level(logging.DEBUG, logger="custom_components.bl_haos")
    caplog.clear()
    with (
        patch("custom_components.bl_haos.client.async_get_clientsession", return_value=bridge_session),
        patch.object(bridge_session, "ws_connect", return_value=websocket),
    ):
        await client._async_listen()
    assert timeline in observed
    assert embedded in observed
    assert client.speakers[address]["playback"] == embedded
    assert "native speaker update" in caplog.text
    for sentinel in (url, "wshostsentinel", "wspathsentinel", "wstokensentinel", "wsartistsentinel"):
        assert sentinel not in caplog.text


@pytest.mark.parametrize("operation", ["play_media", "operationhostsentinel.example/operationpathsentinel", "operationtokensentinel"])
async def test_native_command_redact_untrusted_operation(hass, bridge_session, caplog, operation):
    address = "aa:bb:cc:dd:ee:01"
    bridge_session.command_response = bridge_session.speakers["speakers"][address]
    client = BLHAOSClient(hass, ENDPOINT, TOKEN)
    caplog.set_level(logging.DEBUG, logger="custom_components.bl_haos")
    caplog.clear()
    with patch("custom_components.bl_haos.client.async_get_clientsession", return_value=bridge_session):
        await client.async_command(address, operation)
    assert len(bridge_session.commands) == 1
    assert bridge_session.commands[0][1]["operation"] == operation
    for sentinel in ("operationhostsentinel", "operationpathsentinel", "operationtokensentinel"):
        assert sentinel not in caplog.text


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


async def test_native_websocket_redact_parser_error(hass, bridge_session, caplog):
    client = BLHAOSClient(hass, ENDPOINT, TOKEN)
    secret = "https://parserhostsentinel.example/parserpathsentinel?token=parsertokensentinel"

    def invalid_json():
        raise ValueError(secret)

    bridge_session.websocket_messages = [SimpleNamespace(type=aiohttp.WSMsgType.TEXT, json=invalid_json)]

    async def stop_after_failure(_delay):
        client._closed = True

    caplog.set_level(logging.DEBUG, logger="custom_components.bl_haos")
    caplog.clear()
    with (
        patch("custom_components.bl_haos.client.async_get_clientsession", return_value=bridge_session),
        patch("custom_components.bl_haos.client.asyncio.sleep", AsyncMock(side_effect=stop_after_failure)),
    ):
        await client._async_listen()
    assert not client.transport_available
    assert client.stream_failed_attempts == 1
    for sentinel in (secret, "parserhostsentinel", "parserpathsentinel", "parsertokensentinel"):
        assert sentinel not in caplog.text


async def test_malformed_snapshot_is_rejected(hass, bridge_session):
    client = BLHAOSClient(hass, ENDPOINT, TOKEN)
    bridge_session.speakers = {"speakers": []}

    with pytest.raises(ValueError, match="Invalid BL-HAOS speakers snapshot"):
        await client._async_refresh_snapshot(bridge_session)


async def test_snapshot_eviction_removes_rejected_speaker(hass, bridge_session):
    client = BLHAOSClient(hass, ENDPOINT, TOKEN)
    await client._async_refresh_snapshot(bridge_session)

    bridge_session.speakers["speakers"]["aa:bb:cc:dd:ee:01"]["is_audio_sink"] = False
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


@pytest.mark.parametrize("entity_id", ["media_player.kitchen_speaker", "media_player.office_speaker"])
async def test_native_audio_browse_preserves_provider_metadata_and_hierarchy(hass, bridge_session, entity_id):
    from homeassistant.components.media_player import BrowseMedia, MediaClass

    def item(name, media_class, media_type, *, playable=True, expandable=False, children=None, search=False):
        return BrowseMedia(
            title=name,
            media_class=media_class,
            media_content_type=media_type,
            media_content_id=f"media-source://opaque/{name}?unchanged=%2F",
            can_play=playable,
            can_expand=expandable,
            can_search=search,
            search_media_classes=[MediaClass.TRACK] if search else None,
            thumbnail=f"/api/image/serve/{name}/original",
            children_media_class=MediaClass.DIRECTORY,
            not_shown=7,
            children=children,
        )

    audio = item("video-provider.mp4", "unknown", "audio/flac")
    track = item("image-provider", "track", "provider-specific")
    playlist = item("opaque-playlist", "playlist", "provider-specific", expandable=True, search=True)
    playlist_type = item("playlist-by-type", "unknown", "playlist")
    unknown = item("unknown-provider", "unknown", "unknown", playable=False, expandable=True, search=True)
    empty = item("empty-folder", "directory", "unknown", playable=False, expandable=True, children=[])
    video = item("music-provider.mp3", "video", "video/mp4")
    image = item("audio-provider", "image", "image/jpeg")
    ambiguous = item("looks-like-audio.mp3", "unknown", "unknown")
    branch = item("mixed-provider", "directory", "unknown", playable=False, expandable=True,
                  children=[audio, track, playlist, playlist_type, unknown, empty, video, image, ambiguous])
    video_branch = item("video-container", "video", "video/mp4", playable=False, expandable=True,
                        children=[video])
    root = item("catalog", "directory", "unknown", playable=False, expandable=True,
                children=[branch, video_branch], search=True)
    nodes = [root, branch, video_branch, audio, track, playlist, playlist_type, unknown, empty]
    metadata = [{key: value for key, value in vars(node).items() if key != "children"} for node in nodes]
    await _setup_entry(hass, bridge_session)
    player = hass.data["entity_components"]["media_player"].get_entity(entity_id)

    with patch("custom_components.bl_haos.media_player.async_browse_media", AsyncMock(return_value=root)) as browse:
        result = await player.async_browse_media("provider-type", "media-source://opaque/catalog")

    browse.assert_awaited_once_with(hass, "media-source://opaque/catalog")
    assert [child.title for child in result.children[0].children] == [
        audio.title, track.title, playlist.title, playlist_type.title, unknown.title, empty.title,
    ]
    assert [child.title for child in result.children] == [branch.title, video_branch.title]
    assert result.children[1].children == []
    filtered_nodes = [result, *result.children, *result.children[0].children]
    assert [{key: value for key, value in vars(node).items() if key != "children"}
            for node in filtered_nodes] == metadata
    assert branch.children == [audio, track, playlist, playlist_type, unknown, empty, video, image, ambiguous]


@pytest.mark.parametrize("media_class,media_type", [
    ("album", "unknown"), ("artist", "unknown"), ("composer", "unknown"),
    ("contributing_artist", "unknown"), ("genre", "unknown"), ("music", "unknown"),
    ("podcast", "unknown"), ("track", "unknown"), ("unknown", "music"),
    ("unknown", "audio/mpeg"), ("playlist", "unknown"), ("unknown", "playlist"),
])
def test_native_audio_browse_documented_metadata_policy(media_class, media_type):
    from homeassistant.components.media_player import BrowseMedia
    from custom_components.bl_haos.media_player import _filter_audio_browse

    item = BrowseMedia(
        title="Neutral provider", media_class=media_class, media_content_type=media_type,
        media_content_id="media-source://opaque/reference", can_play=True, can_expand=False,
    )
    result = _filter_audio_browse(item)
    assert result is not None
    assert vars(result) == vars(item)


@pytest.mark.parametrize("media_class,media_type", [("video", "video/mp4"), ("image", "image/jpeg")])
async def test_native_audio_browse_rejects_unsupported_direct_leaf(hass, bridge_session, media_class, media_type):
    from homeassistant.components.media_player import BrowseMedia
    from homeassistant.exceptions import HomeAssistantError

    await _setup_entry(hass, bridge_session)
    player = hass.data["entity_components"]["media_player"].get_entity("media_player.kitchen_speaker")
    leaf = BrowseMedia(
        title="Unsupported", media_class=media_class, media_content_type=media_type,
        media_content_id="media-source://opaque/reference", can_play=True, can_expand=False,
    )
    with (
        patch("custom_components.bl_haos.media_player.async_browse_media", AsyncMock(return_value=leaf)),
        pytest.raises(HomeAssistantError, match="not supported for audio playback"),
    ):
        await player.async_browse_media(media_type, leaf.media_content_id)


async def test_native_play_media_relative_resolution_uses_core_url_processing(hass, bridge_session):
    from homeassistant.components.media_source.models import PlayMedia

    entry = await _setup_entry(hass, bridge_session)
    player = hass.data["entity_components"]["media_player"].get_entity("media_player.kitchen_speaker")
    hass.config.internal_url = "http://ha-internal.example.test:8123"
    reference = "media-source://opaque/local%2Faudio"
    with (
        patch("custom_components.bl_haos.media_player.async_resolve_media",
              AsyncMock(return_value=PlayMedia("/media/local/audio?authSig=core-supplied", "audio/mpeg"))) as resolve,
        patch.object(entry.runtime_data.client, "async_command", new=AsyncMock()) as command,
    ):
        await player.async_play_media("music", reference)
    resolve.assert_awaited_once_with(hass, reference, player.entity_id)
    command.assert_awaited_once_with(
        "aa:bb:cc:dd:ee:01", "play_media",
        url="http://ha-internal.example.test:8123/media/local/audio?authSig=core-supplied", media_type="audio/mpeg",
    )


@pytest.mark.parametrize("entity_id,address", [
    ("media_player.kitchen_speaker", "aa:bb:cc:dd:ee:01"),
    ("media_player.office_speaker", "aa:bb:cc:dd:ee:02"),
])
@pytest.mark.parametrize("media_type", ["music", "playlist"])
async def test_native_play_media_resolves_one_opaque_reference(hass, bridge_session, entity_id, address, media_type):
    from homeassistant.components.media_source.models import PlayMedia

    entry = await _setup_entry(hass, bridge_session)
    player = hass.data["entity_components"]["media_player"].get_entity(entity_id)
    reference = "media-source://opaque/Not-a-URL%2Fentry?selection=unchanged"
    resolved = PlayMedia("https://stream.example.test/audio?signature=private", "audio/flac")
    with (
        patch("custom_components.bl_haos.media_player.async_resolve_media", AsyncMock(return_value=resolved)) as resolve,
        patch("custom_components.bl_haos.media_player.async_process_play_media_url", return_value=resolved.url) as process,
        patch.object(entry.runtime_data.client, "async_command", new=AsyncMock()) as command,
    ):
        await player.async_play_media(media_type, reference)

    resolve.assert_awaited_once_with(hass, reference, entity_id)
    process.assert_called_once_with(hass, resolved.url)
    command.assert_awaited_once_with(address, "play_media", url=resolved.url, media_type="audio/flac")
    assert bridge_session.commands == []


@pytest.mark.parametrize("enqueue", ["add", "next", "replace", "play"])
async def test_native_play_media_playlist_rejects_enqueue_before_resolution(hass, bridge_session, enqueue):
    from homeassistant.exceptions import HomeAssistantError

    entry = await _setup_entry(hass, bridge_session)
    player = hass.data["entity_components"]["media_player"].get_entity("media_player.kitchen_speaker")
    with (
        patch("custom_components.bl_haos.media_player.async_resolve_media", new=AsyncMock()) as resolve,
        patch.object(entry.runtime_data.client, "async_command", new=AsyncMock()) as command,
        pytest.raises(HomeAssistantError, match="does not support queued playback"),
    ):
        await player.async_play_media("playlist", "media-source://opaque/playlist", enqueue=enqueue)
    resolve.assert_not_awaited()
    command.assert_not_awaited()


@pytest.mark.parametrize("failure", ["denied", "expired", "unavailable", "unresolvable", "timeout"])
async def test_native_play_media_resolution_failure_is_bounded(hass, bridge_session, failure):
    from homeassistant.components.media_source.error import Unresolvable
    from homeassistant.exceptions import HomeAssistantError, Unauthorized

    detail = "https://user:password@private.example.test/full/path?token=credential " + "secret" * 200
    errors = {
        "denied": Unauthorized(),
        "expired": PermissionError(detail),
        "unavailable": aiohttp.ClientError(detail),
        "unresolvable": Unresolvable(detail),
        "timeout": TimeoutError(detail),
    }
    entry = await _setup_entry(hass, bridge_session)
    player = hass.data["entity_components"]["media_player"].get_entity("media_player.office_speaker")
    reference = "media-source://opaque/original%2Fplaylist"
    with (
        patch("custom_components.bl_haos.media_player.async_resolve_media", AsyncMock(side_effect=errors[failure])) as resolve,
        patch("custom_components.bl_haos.media_player.async_process_play_media_url") as process,
        patch.object(entry.runtime_data.client, "async_command", new=AsyncMock()) as command,
        pytest.raises(HomeAssistantError) as raised,
    ):
        await player.async_play_media("playlist", reference)
    assert str(raised.value) == "Home Assistant could not resolve this media item; check provider access and availability"
    assert raised.value.__suppress_context__
    resolve.assert_awaited_once_with(hass, reference, player.entity_id)
    process.assert_not_called()
    command.assert_not_awaited()
    assert bridge_session.commands == []


@pytest.mark.parametrize("url", [
    "", None, "media-source://opaque/still-unresolved", "not-a-playable-url",
    "https:///missing-host", "file:///private/audio.mp3", "//other.example.test/audio",
])
async def test_native_play_media_invalid_resolution_sends_no_command(hass, bridge_session, url):
    from homeassistant.components.media_source.models import PlayMedia
    from homeassistant.exceptions import HomeAssistantError

    entry = await _setup_entry(hass, bridge_session)
    player = hass.data["entity_components"]["media_player"].get_entity("media_player.kitchen_speaker")
    reference = "media-source://opaque/original"
    with (
        patch("custom_components.bl_haos.media_player.async_resolve_media", AsyncMock(return_value=PlayMedia(url, "audio/mpeg"))) as resolve,
        patch.object(entry.runtime_data.client, "async_command", new=AsyncMock()) as command,
        pytest.raises(HomeAssistantError) as raised,
    ):
        await player.async_play_media("music", reference)
    assert str(raised.value) == "Home Assistant could not resolve this media item; check provider access and availability"
    resolve.assert_awaited_once_with(hass, reference, player.entity_id)
    command.assert_not_awaited()


@pytest.mark.parametrize("unavailable", ["speaker", "bridge"])
async def test_native_play_media_unavailable_target_never_resolves(hass, bridge_session, unavailable):
    from homeassistant.components.media_source.models import PlayMedia
    from homeassistant.exceptions import HomeAssistantError

    entry = await _setup_entry(hass, bridge_session)
    player = hass.data["entity_components"]["media_player"].get_entity("media_player.kitchen_speaker")
    if unavailable == "speaker":
        entry.runtime_data.client.speakers["aa:bb:cc:dd:ee:01"]["connected"] = False
    else:
        entry.runtime_data.client.transport_available = False
    with (
        patch("custom_components.bl_haos.media_player.async_resolve_media",
              AsyncMock(return_value=PlayMedia("https://example.test/audio", "audio/mpeg"))) as resolve,
        patch.object(entry.runtime_data.client, "async_command", new=AsyncMock()) as command,
        pytest.raises(HomeAssistantError, match="Selected BL-HAOS speaker is unavailable"),
    ):
        await player.async_play_media("playlist", "media-source://opaque/playlist")
    resolve.assert_not_awaited()
    command.assert_not_awaited()


@pytest.mark.parametrize("entity_id,address", [
    ("media_player.kitchen_speaker", "aa:bb:cc:dd:ee:01"),
    ("media_player.office_speaker", "aa:bb:cc:dd:ee:02"),
])
@pytest.mark.parametrize("failure,second_succeeds", [
    (aiohttp.ServerDisconnectedError, True),
    (aiohttp.ServerDisconnectedError, False),
    (TimeoutError, True),
    (aiohttp.ClientError, True),
])
async def test_native_play_media_command_failure_is_bounded_without_retry(
    hass, bridge_session, entity_id, address, failure, second_succeeds,
):
    from homeassistant.components.media_source.models import PlayMedia
    from homeassistant.exceptions import HomeAssistantError

    await _setup_entry(hass, bridge_session)
    player = hass.data["entity_components"]["media_player"].get_entity(entity_id)
    reference = "media-source://opaque/original%2Fplaylist?selection=unchanged"
    resolved = PlayMedia("https://user:password@private.example.test/full/path?token=credential", "audio/mpeg")
    bridge_session.command_response = bridge_session.speakers["speakers"][address]
    served_post = bridge_session.post
    applied = []

    class AppliedWithoutAcknowledgement(FakeResponse):
        async def __aenter__(self):
            applied.append(address)
            raise failure(resolved.url + " secret" * 200)

    def ambiguous_post(url, **kwargs):
        response = served_post(url, **kwargs)
        if len(bridge_session.commands) == 1 or not second_succeeds:
            return AppliedWithoutAcknowledgement({})
        return response

    with (
        patch("custom_components.bl_haos.media_player.async_resolve_media", AsyncMock(return_value=resolved)) as resolve,
        patch("custom_components.bl_haos.media_player.async_process_play_media_url", return_value=resolved.url) as process,
        patch("custom_components.bl_haos.client.async_get_clientsession", return_value=bridge_session),
        patch.object(bridge_session, "post", side_effect=ambiguous_post),
        patch("custom_components.bl_haos.client.asyncio.sleep", new=AsyncMock()) as sleep,
        pytest.raises(HomeAssistantError) as raised,
    ):
        await player.async_play_media("playlist", reference)
    assert str(raised.value) == "BL-HAOS could not submit this media item; check the speaker connection and provider access"
    assert raised.value.__suppress_context__
    assert raised.value.__cause__ is None
    resolve.assert_awaited_once_with(hass, reference, entity_id)
    process.assert_called_once_with(hass, resolved.url)
    assert bridge_session.commands == [(
        f"{ENDPOINT}/api/native/speakers/{address}/command",
        {"version": 1, "operation": "play_media", "url": resolved.url, "media_type": "audio/mpeg"},
    )]
    assert applied == [address]
    sleep.assert_not_awaited()


@pytest.mark.parametrize("operation", ["queue_start", "next", "previous"])
async def test_queue_commands_are_single_attempt_after_ambiguous_acknowledgement(
    hass, bridge_session, operation,
):
    entry = await _setup_entry(hass, bridge_session)
    address = "aa:bb:cc:dd:ee:01"
    bridge_session.command_response = aiohttp.ServerDisconnectedError("acknowledgement lost")
    client = entry.runtime_data.client

    with (
        patch("custom_components.bl_haos.client.async_get_clientsession", return_value=bridge_session),
        patch("custom_components.bl_haos.client.asyncio.sleep", new=AsyncMock()) as sleep,
        pytest.raises(aiohttp.ClientError),
    ):
        await client.async_command(address, operation)

    assert len(bridge_session.commands) == 1
    assert bridge_session.commands[0][1]["operation"] == operation
    sleep.assert_not_awaited()


async def test_native_play_media_target_disconnect_during_resolution_sends_no_command(hass, bridge_session):
    from homeassistant.components.media_source.models import PlayMedia
    from homeassistant.exceptions import HomeAssistantError

    entry = await _setup_entry(hass, bridge_session)
    player = hass.data["entity_components"]["media_player"].get_entity("media_player.kitchen_speaker")

    async def resolve_then_disconnect(*args):
        entry.runtime_data.client.speakers["aa:bb:cc:dd:ee:01"]["connected"] = False
        return PlayMedia("https://example.test/audio", "audio/mpeg")

    with (
        patch("custom_components.bl_haos.media_player.async_resolve_media", AsyncMock(side_effect=resolve_then_disconnect)) as resolve,
        patch.object(entry.runtime_data.client, "async_command", new=AsyncMock()) as command,
        pytest.raises(HomeAssistantError, match="Selected BL-HAOS speaker is unavailable"),
    ):
        await player.async_play_media("playlist", "media-source://opaque/playlist")
    resolve.assert_awaited_once_with(hass, "media-source://opaque/playlist", player.entity_id)
    command.assert_not_awaited()


async def test_native_play_media_requires_explicit_entity_id(hass, bridge_session):
    from homeassistant.exceptions import HomeAssistantError

    entry = await _setup_entry(hass, bridge_session)
    player = hass.data["entity_components"]["media_player"].get_entity("media_player.kitchen_speaker")
    with (
        patch.object(player, "entity_id", None),
        patch("custom_components.bl_haos.media_player.async_resolve_media", new=AsyncMock()) as resolve,
        patch.object(entry.runtime_data.client, "async_command", new=AsyncMock()) as command,
        pytest.raises(HomeAssistantError, match="Selected BL-HAOS speaker is unavailable"),
    ):
        await player.async_play_media("music", "media-source://opaque/item")
    resolve.assert_not_awaited()
    command.assert_not_awaited()


async def test_native_play_media_resolution_cancellation_is_not_retried(hass, bridge_session):
    from asyncio import CancelledError

    entry = await _setup_entry(hass, bridge_session)
    player = hass.data["entity_components"]["media_player"].get_entity("media_player.office_speaker")
    with (
        patch("custom_components.bl_haos.media_player.async_resolve_media", AsyncMock(side_effect=CancelledError)) as resolve,
        patch.object(entry.runtime_data.client, "async_command", new=AsyncMock()) as command,
        pytest.raises(CancelledError),
    ):
        await player.async_play_media("music", "media-source://opaque/item")
    resolve.assert_awaited_once_with(hass, "media-source://opaque/item", player.entity_id)
    command.assert_not_awaited()


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