"""In-process Home Assistant SIL coverage for saved playlist persistence."""

from __future__ import annotations

import asyncio
import json
from pathlib import Path
from unittest.mock import AsyncMock, patch
from typing import Any

import aiohttp
import pytest
from homeassistant.components.media_player import BrowseError, MediaClass
from homeassistant.components.media_source import BrowseMediaSource, MediaSource, MediaSourceItem, PlayMedia
from homeassistant.components.media_source.const import DATA_MEDIA_SOURCE_PLATFORMS
from homeassistant.helpers.storage import Store
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.bl_haos.const import CONF_ENDPOINT, CONF_TOKEN, DOMAIN
from custom_components.bl_haos.playlist_library import (
    LIBRARY_DATA,
    LIBRARY_STORE_KEY,
    MAX_LIBRARY_BYTES,
    MAX_MEDIA_CLASS_BYTES,
    MAX_MEDIA_ID_BYTES,
    MAX_NAME_BYTES,
    MAX_RECORDS,
    MAX_TITLE_BYTES,
    MAX_CONTENT_TYPE_BYTES,
    PlaylistLibrary,
    PlaylistLibraryConflictError,
    PlaylistLibraryStorageError,
    PlaylistLibraryValidationError,
    async_setup as async_setup_playlist_library,
)
from tests.conftest import FakeSession, load_snapshot

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")

ENDPOINT = "http://bl-haos:8099"
TOKEN = "sil-test-token"


class _SyntheticAvailabilitySource(MediaSource):
    def __init__(self) -> None:
        super().__init__("bl_haos_availability_probe")
        self.browse_calls: list[str] = []
        self.resolve_calls: list[str] = []

    async def async_browse_media(self, item: MediaSourceItem) -> BrowseMediaSource:
        self.browse_calls.append(item.media_source_id)
        if item.identifier.startswith("denied"):
            raise BrowseError("synthetic browse denial")
        return BrowseMediaSource(
            domain=self.domain,
            identifier=item.identifier,
            title="Synthetic non-playable browse item",
            media_class=MediaClass.MUSIC,
            media_content_type="audio/mpeg",
            can_play=False,
            can_expand=False,
        )

    async def async_resolve_media(self, item: MediaSourceItem) -> PlayMedia:
        self.resolve_calls.append(item.media_source_id)
        return PlayMedia("https://provider.invalid/resolved", "audio/mpeg")


class _SyntheticAvailabilityPlatforms:
    def __init__(self, source: _SyntheticAvailabilitySource) -> None:
        self.source = source

    async def async_get_platform(self, domain: str) -> MediaSource | None:
        return self.source if domain == self.source.domain else None

    async def async_get_platforms(self) -> dict[str, MediaSource]:
        return {self.source.domain: self.source}


@pytest.fixture
def hass_storage() -> dict[str, Any]:
    """Use Core's real Store writer for these isolated persistence tests."""
    return {}


async def test_core_store_persists_with_playlist_sil_fixture(hass, tmp_path):
    hass.config.config_dir = str(tmp_path)
    store = Store(hass, 1, "bl_haos.playlist_library_probe", atomic_writes=True)
    assert await store.async_load() is None
    await store.async_save({"revision": 1, "records": []})
    assert Path(store.path).is_file()


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
    hass, bridge_session, hass_ws_client, socket_enabled, tmp_path, hass_storage
):
    """An authenticated HA user can create an empty playlist through the shared library."""
    hass.config.config_dir = str(tmp_path)
    await async_setup_component(hass, "websocket_api", {})
    await _setup_entry(hass, bridge_session)

    record_id = "c3f8941d-7e2b-4a11-8b3f-5c6d7e8f9012"
    async with await hass_ws_client() as websocket:
        await websocket.send_json_auto_id({"type": "bl_haos/playlist_library/list"})
        listed = await websocket.receive_json()
        assert listed["success"] is True
        assert listed["result"] == {"schema_version": 2, "revision": 0, "records": []}

        create = {
            "type": "bl_haos/playlist_library/save_custom",
            "record_id": record_id,
            "name": "Quiet hours",
            "entries": [],
            "revision": 0,
        }
        await websocket.send_json_auto_id(create)
        created = await websocket.receive_json()
        assert created["success"] is True, created
        assert created["result"]["records"] == [
            {
                "record_id": record_id,
                "record_revision": 1,
                "kind": "custom",
                "name": "Quiet hours",
                "entries": [],
            }
        ]

        await websocket.send_json_auto_id(create)
        retried = await websocket.receive_json()
        assert retried["success"] is True
        assert len(retried["result"]["records"]) == 1
        assert retried["result"]["records"][0]["record_id"] == record_id
        assert retried["result"]["records"][0]["entries"] == []

        duplicate_name_id = "d4e9052e-8f3c-4b22-9c4f-6d7e8f9012ab"
        await websocket.send_json_auto_id({**create, "record_id": duplicate_name_id, "revision": 1})
        distinct = await websocket.receive_json()
        assert distinct["success"] is True
        assert distinct["result"]["records"] == [
            {
                "record_id": record_id,
                "record_revision": 1,
                "kind": "custom",
                "name": "Quiet hours",
                "entries": [],
            },
            {
                "record_id": duplicate_name_id,
                "record_revision": 2,
                "kind": "custom",
                "name": "Quiet hours",
                "entries": [],
            },
        ]
        persisted = await Store(hass, 1, LIBRARY_STORE_KEY, atomic_writes=True).async_load()
        assert persisted == distinct["result"]


async def test_custom_playlist_start_resolves_every_reference_before_one_queue_command(
    hass, bridge_session, hass_ws_client, socket_enabled, tmp_path
):
    from homeassistant.components.media_source.models import PlayMedia

    hass.config.config_dir = str(tmp_path)
    await async_setup_component(hass, "websocket_api", {})
    address = "aa:bb:cc:dd:ee:01"
    bridge_session.speakers["speakers"][address]["queue_version"] = 1
    entry = await _setup_entry(hass, bridge_session)
    first_reference = "media-source://provider/first%2Fopaque"
    second_reference = "media-source://provider/second?order=a%2Bb"
    first_url = "https://provider.test/first?sig=first-secret"
    second_url = "https://provider.test/second?sig=second-secret"
    resolutions = [
        PlayMedia(first_url, "audio/mpeg"),
        PlayMedia(second_url, "audio/flac"),
    ]
    resolver = AsyncMock(side_effect=resolutions)
    processor = lambda _hass, url: url
    bridge_session.command_response = bridge_session.speakers["speakers"][address]

    async with await hass_ws_client() as websocket:
        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/save_custom",
                "record_id": "c3f8941d-7e2b-4a11-8b3f-5c6d7e8f9012",
                "name": "Ordered queue",
                "entries": [
                    {"media_content_id": first_reference, "title": "First"},
                    {"media_content_id": second_reference, "title": "Second"},
                ],
                "revision": 0,
            }
        )
        saved = await websocket.receive_json()
        assert saved["success"] is True
        saved_library = saved["result"]
        assert saved_library["records"] == [{
            "record_id": "c3f8941d-7e2b-4a11-8b3f-5c6d7e8f9012",
            "record_revision": 1,
            "kind": "custom",
            "name": "Ordered queue",
            "entries": [
                {"media_content_id": first_reference, "title": "First"},
                {"media_content_id": second_reference, "title": "Second"},
            ],
        }]
        store_path = Path(hass.data[LIBRARY_DATA].store.path)
        persisted_before_start = await Store(hass, 1, LIBRARY_STORE_KEY, atomic_writes=True).async_load()
        persisted_bytes_before_start = store_path.read_bytes()
        assert persisted_before_start == saved_library
        with (
            patch("custom_components.bl_haos.media_player.async_resolve_media", resolver),
            patch("custom_components.bl_haos.media_player.async_process_play_media_url", processor),
            patch("custom_components.bl_haos.client.async_get_clientsession", return_value=bridge_session),
        ):
            await websocket.send_json_auto_id(
                {
                    "type": "bl_haos/playlist_library/start",
                    "record_id": "c3f8941d-7e2b-4a11-8b3f-5c6d7e8f9012",
                    "entity_id": "media_player.kitchen_speaker",
                }
            )
            started = await websocket.receive_json()

    assert started["success"] is True, started
    assert [call.args[1] for call in resolver.await_args_list] == [first_reference, second_reference]
    assert all(call.args[2] == "media_player.kitchen_speaker" for call in resolver.await_args_list)
    assert bridge_session.commands == [(
        f"{ENDPOINT}/api/native/speakers/{address}/command",
        {
            "version": 1,
            "operation": "queue_start",
            "queue_version": 1,
            "playlist": "Ordered queue",
            "items": [
                {"url": first_url, "title": "First"},
                {"url": second_url, "title": "Second"},
            ],
        },
    )]
    assert entry.runtime_data.client.get_speaker(address)["queue_version"] == 1
    assert store_path.read_bytes() == persisted_bytes_before_start
    assert await Store(hass, 1, LIBRARY_STORE_KEY, atomic_writes=True).async_load() == persisted_before_start


async def test_custom_playlist_start_resolution_failure_preserves_existing_queue(
    hass, bridge_session, hass_ws_client, socket_enabled, tmp_path
):
    from homeassistant.components.media_source.models import PlayMedia

    hass.config.config_dir = str(tmp_path)
    await async_setup_component(hass, "websocket_api", {})
    address = "aa:bb:cc:dd:ee:01"
    bridge_session.speakers["speakers"][address]["queue_version"] = 1
    await _setup_entry(hass, bridge_session)
    first_reference = "media-source://provider/first"
    failed_reference = "media-source://provider/fails"
    resolver = AsyncMock(
        side_effect=[PlayMedia("https://provider.test/first", "audio/mpeg"), RuntimeError("signed-secret")]
    )
    bridge_session.commands.clear()

    async with await hass_ws_client() as websocket:
        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/save_custom",
                "record_id": "d3f8941d-7e2b-4a11-8b3f-5c6d7e8f9012",
                "name": "Keep current queue",
                "entries": [
                    {"media_content_id": first_reference, "title": "First"},
                    {"media_content_id": failed_reference, "title": "Second"},
                ],
                "revision": 0,
            }
        )
        assert (await websocket.receive_json())["success"] is True
        with (
            patch("custom_components.bl_haos.media_player.async_resolve_media", resolver),
            patch("custom_components.bl_haos.media_player.async_process_play_media_url", side_effect=lambda _hass, url: url),
        ):
            await websocket.send_json_auto_id(
                {
                    "type": "bl_haos/playlist_library/start",
                    "record_id": "d3f8941d-7e2b-4a11-8b3f-5c6d7e8f9012",
                    "entity_id": "media_player.kitchen_speaker",
                }
            )
            failed = await websocket.receive_json()

    assert failed["success"] is False
    assert "item 2" in failed["error"]["message"]
    assert "signed-secret" not in str(failed)
    assert resolver.await_count == 2
    assert bridge_session.commands == []


async def test_custom_playlist_start_rechecks_selected_speaker_after_resolution(
    hass, bridge_session, hass_ws_client, socket_enabled, tmp_path
):
    from homeassistant.components.media_source.models import PlayMedia

    hass.config.config_dir = str(tmp_path)
    await async_setup_component(hass, "websocket_api", {})
    address = "aa:bb:cc:dd:ee:01"
    bridge_session.speakers["speakers"][address]["queue_version"] = 1
    entry = await _setup_entry(hass, bridge_session)
    reference = "media-source://provider/one"

    async def disconnect_during_resolution(_hass, _reference, _entity_id):
        speaker = bridge_session.speakers["speakers"][address]
        speaker["connected"] = False
        speaker["available"] = False
        entry.runtime_data.client._async_process_speaker(speaker)
        return PlayMedia("https://provider.test/transient", "audio/mpeg")

    bridge_session.commands.clear()
    async with await hass_ws_client() as websocket:
        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/save_custom",
                "record_id": "e3f8941d-7e2b-4a11-8b3f-5c6d7e8f9012",
                "name": "Disconnect during lookup",
                "entries": [{"media_content_id": reference, "title": "One"}],
                "revision": 0,
            }
        )
        assert (await websocket.receive_json())["success"] is True
        with (
            patch(
                "custom_components.bl_haos.media_player.async_resolve_media",
                side_effect=disconnect_during_resolution,
            ),
            patch("custom_components.bl_haos.media_player.async_process_play_media_url", side_effect=lambda _hass, url: url),
        ):
            await websocket.send_json_auto_id(
                {
                    "type": "bl_haos/playlist_library/start",
                    "record_id": "e3f8941d-7e2b-4a11-8b3f-5c6d7e8f9012",
                    "entity_id": "media_player.kitchen_speaker",
                }
            )
            result = await websocket.receive_json()

    assert result["success"] is False
    assert "became unavailable" in result["error"]["message"]
    assert "provider.test" not in str(result)
    assert bridge_session.commands == []


async def test_resolved_playlist_payload_bound_is_enforced_before_native_submission(
    hass, bridge_session
):
    from homeassistant.components.media_source.models import PlayMedia
    from homeassistant.exceptions import HomeAssistantError

    address = "aa:bb:cc:dd:ee:01"
    bridge_session.speakers["speakers"][address]["queue_version"] = 1
    entry = await _setup_entry(hass, bridge_session)
    player = hass.data["entity_components"]["media_player"].get_entity("media_player.kitchen_speaker")
    reference = "media-source://provider/opaque"
    resolved_url = f"https://provider.test/{'x' * 1900}"
    resolver = AsyncMock(return_value=PlayMedia(resolved_url, "audio/mpeg"))
    record = {
        "kind": "custom",
        "name": "Large resolved batch",
        "entries": [{"media_content_id": reference} for _ in range(137)],
    }
    bridge_session.commands.clear()

    with (
        patch("custom_components.bl_haos.media_player.async_resolve_media", resolver),
        patch("custom_components.bl_haos.media_player.async_process_play_media_url", side_effect=lambda _hass, url: url),
        pytest.raises(HomeAssistantError, match="payload limit"),
    ):
        await player.async_start_queue(record)

    assert resolver.await_count == 137
    assert "queue_version" in entry.runtime_data.client.get_speaker(address)
    assert bridge_session.commands == []


async def test_provider_shortcut_starts_as_one_atomic_queue_item(
    hass, bridge_session, hass_ws_client, socket_enabled, tmp_path
):
    from homeassistant.components.media_source.models import PlayMedia

    hass.config.config_dir = str(tmp_path)
    await async_setup_component(hass, "websocket_api", {})
    address = "aa:bb:cc:dd:ee:01"
    bridge_session.speakers["speakers"][address]["queue_version"] = 1
    await _setup_entry(hass, bridge_session)
    reference = "media-source://provider/opaque%2Fplaylist?order=a%2Bb"
    resolved_url = "https://provider.test/playlist.m3u?signature=transient"
    resolver = AsyncMock(return_value=PlayMedia(resolved_url, "audio/mpeg"))
    bridge_session.command_response = bridge_session.speakers["speakers"][address]

    async with await hass_ws_client() as websocket:
        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/save_provider",
                "media_content_id": reference,
                "name": "Provider mix",
                "title": "Saved provider mix",
            }
        )
        saved = await websocket.receive_json()
        assert saved["success"] is True
        record_id = saved["result"]["records"][0]["record_id"]
        with (
            patch("custom_components.bl_haos.media_player.async_resolve_media", resolver),
            patch("custom_components.bl_haos.media_player.async_process_play_media_url", side_effect=lambda _hass, url: url),
            patch("custom_components.bl_haos.client.async_get_clientsession", return_value=bridge_session),
        ):
            await websocket.send_json_auto_id(
                {
                    "type": "bl_haos/playlist_library/start",
                    "record_id": record_id,
                    "entity_id": "media_player.kitchen_speaker",
                }
            )
            started = await websocket.receive_json()

    assert started["success"] is True
    resolver.assert_awaited_once_with(hass, reference, "media_player.kitchen_speaker")
    assert bridge_session.commands[0][1]["operation"] == "queue_start"
    assert bridge_session.commands[0][1]["items"] == [
        {"url": resolved_url, "title": "Saved provider mix"},
    ]


async def test_playlist_library_create_fails_closed_for_preexisting_unreadable_storage(hass, tmp_path):
    hass.config.config_dir = str(tmp_path)
    await async_setup_playlist_library(hass, {})
    library = hass.data[LIBRARY_DATA]
    assert await library.async_list() == {"schema_version": 2, "revision": 0, "records": []}

    path = Path(library.store.path)
    path.parent.mkdir(parents=True, exist_ok=True)
    original = b"preserve this unreadable storage file"
    path.write_bytes(original)
    unreadable_library = PlaylistLibrary(hass)
    with patch.object(unreadable_library.store, "async_load", return_value=None):
        with pytest.raises(PlaylistLibraryStorageError):
            await unreadable_library.async_list()
    assert path.read_bytes() == original


async def test_playlist_library_reload_persistence_keeps_global_store_and_records(
    hass, bridge_session, hass_ws_client, socket_enabled, tmp_path, hass_storage
):
    hass.config.config_dir = str(tmp_path)
    entry = await _setup_entry(hass, bridge_session)
    library = hass.data[LIBRARY_DATA]
    storage_path = Path(library.store.path)
    record_id = "e5fa163f-904d-4c33-ad5e-7e8f9012bcde"
    entries = [
        {"media_content_id": "media-source://provider/one%2Fopaque", "title": "First"},
        {"media_content_id": "media-source://provider/two?order=a%2Bb", "title": "Second"},
    ]

    async with await hass_ws_client() as websocket:
        await websocket.send_json_auto_id({
            "type": "bl_haos/playlist_library/save_custom",
            "record_id": record_id,
            "name": "Ordered references",
            "entries": entries,
            "revision": 0,
        })
        created = await websocket.receive_json()
        assert created["success"] is True, created
        saved_records = created["result"]["records"]
        assert saved_records[0]["entries"] == entries
        before_reload = storage_path.read_bytes()
        registered_handler = hass.data["websocket_api"]["bl_haos/playlist_library/list"][0]

        replacement_session = FakeSession(load_snapshot("speakers_initial.json"))
        with (
            patch("custom_components.bl_haos.client.async_get_clientsession", return_value=replacement_session),
            patch("custom_components.bl_haos.config_flow.async_get_clientsession", return_value=replacement_session),
        ):
            assert await hass.config_entries.async_reload(entry.entry_id)
            await hass.async_block_till_done()

        assert hass.data[LIBRARY_DATA] is library
        assert hass.data["websocket_api"]["bl_haos/playlist_library/list"][0] is registered_handler
        assert storage_path.read_bytes() == before_reload
        with patch(
            "homeassistant.components.websocket_api.async_register_command",
            wraps=__import__("homeassistant.components.websocket_api", fromlist=["async_register_command"]).async_register_command,
        ) as register_command:
            assert await async_setup_playlist_library(hass, {})
            register_command.assert_not_called()

        fresh_store = Store(hass, 1, LIBRARY_STORE_KEY, atomic_writes=True)
        reconstructed = await fresh_store.async_load()
        assert reconstructed == {"schema_version": 2, "revision": 1, "records": saved_records}
        assert reconstructed["records"][0]["entries"] == entries

        await websocket.send_json_auto_id({"type": "bl_haos/playlist_library/list"})
        listed = await websocket.receive_json()
        assert listed["success"] is True
        assert listed["result"] == reconstructed


def _media_entry(
    media_content_id: str = "media-source://provider/opaque%2Fid?order=a%2Bb",
) -> dict[str, Any]:
    return {
        "media_content_id": media_content_id,
        "title": "Saved title",
        "media_class": "music",
        "media_content_type": "audio/mpeg",
    }


async def test_authenticated_library_read_preserves_custom_and_provider_record_shape(
    hass, hass_ws_client, socket_enabled, tmp_path
):
    hass.config.config_dir = str(tmp_path)
    await async_setup_component(hass, "websocket_api", {})
    await async_setup_playlist_library(hass, {})
    library = hass.data[LIBRARY_DATA]
    custom_id = "a1111111-1111-4111-8111-111111111111"
    first_reference = "media-source://provider/first%2Fopaque?slot=1%2Ba"
    second_reference = "media-source://provider/second%2Fopaque?slot=2%2Bb"
    provider_reference = "media-source://provider/list%2Fopaque?view=full%2Blist"
    custom_entries = [_media_entry(first_reference), _media_entry(second_reference)]
    created_custom = await library.async_save_custom(custom_id, "Saved order", custom_entries, 0)
    created = await library.async_save_provider(
        provider_reference,
        "Provider shortcut label",
        {"title": "Home Assistant playlist", "media_class": "playlist", "media_content_type": "provider/playlist"},
    )
    expected = {
        "schema_version": 2,
        "revision": 2,
        "records": [
            {
                "record_id": custom_id,
                "record_revision": 1,
                "kind": "custom",
                "name": "Saved order",
                "entries": custom_entries,
            },
            {
                "record_id": created["records"][1]["record_id"],
                "record_revision": 2,
                "kind": "provider",
                "name": "Provider shortcut label",
                "media_content_id": provider_reference,
                "title": "Home Assistant playlist",
                "media_class": "playlist",
                "media_content_type": "provider/playlist",
            },
        ],
    }
    storage_path = Path(library.store.path)
    stored_bytes = storage_path.read_bytes()

    async with await hass_ws_client() as websocket:
        await websocket.send_json_auto_id({"type": "bl_haos/playlist_library/list"})
        listed = await websocket.receive_json()

    assert listed["success"] is True
    assert listed["result"] == expected
    assert [record["record_id"] for record in listed["result"]["records"]] == [
        custom_id, created["records"][1]["record_id"],
    ]
    assert listed["result"]["records"][0]["entries"] == custom_entries
    assert listed["result"]["records"][1]["media_content_id"] == provider_reference
    assert listed["result"]["records"][1]["name"] == "Provider shortcut label"
    assert storage_path.read_bytes() == stored_bytes
    assert await Store(hass, 1, LIBRARY_STORE_KEY, atomic_writes=True).async_load() == expected


async def test_playlist_library_provider_shortcut_retry_and_local_rename_remove(
    hass, hass_ws_client, socket_enabled, tmp_path
):
    hass.config.config_dir = str(tmp_path)
    await async_setup_component(hass, "websocket_api", {})
    await async_setup_playlist_library(hass, {})
    reference = "media-source://provider/playlist%2Fopaque?order=a%2Bb"
    other_reference = "media-source://provider/another%2Fopaque?order=a%2Bb"

    async with await hass_ws_client() as websocket:
        save = {
            "type": "bl_haos/playlist_library/save_provider",
            "media_content_id": reference,
            "name": "My local mix",
            "title": "Provider title",
            "media_class": "music",
            "media_content_type": "playlist",
        }
        await websocket.send_json_auto_id(save)
        first = await websocket.receive_json()
        assert first["success"] is True, first
        first_library = first["result"]
        first_record = first_library["records"][0]
        assert first_record == {
            "record_id": first_record["record_id"],
            "record_revision": 1,
            "kind": "provider",
            "name": "My local mix",
            "media_content_id": reference,
            "title": "Provider title",
            "media_class": "music",
            "media_content_type": "playlist",
        }

        await websocket.send_json_auto_id(
            {
                **save,
                "name": "Retry must not rename",
                "title": "Retry must not replace metadata",
            }
        )
        retried = await websocket.receive_json()
        assert retried["success"] is True
        assert retried["result"] == first_library

        await websocket.send_json_auto_id({**save, "media_content_id": other_reference})
        distinct = await websocket.receive_json()
        assert distinct["success"] is True
        assert [record["name"] for record in distinct["result"]["records"]] == [
            "My local mix",
            "My local mix",
        ]
        assert [record["media_content_id"] for record in distinct["result"]["records"]] == [
            reference,
            other_reference,
        ]

        custom_id = "f1111111-1111-4111-8111-111111111111"
        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/save_custom",
                "record_id": custom_id,
                "name": "My local mix",
                "entries": [_media_entry()],
                "revision": distinct["result"]["revision"],
            }
        )
        custom = await websocket.receive_json()
        assert custom["success"] is True
        assert len(custom["result"]["records"]) == 3

        first_id = first_record["record_id"]
        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/rename_provider",
                "record_id": first_id,
                "name": "Renamed locally",
                "revision": custom["result"]["revision"],
            }
        )
        renamed = await websocket.receive_json()
        assert renamed["success"] is True
        renamed_record = renamed["result"]["records"][0]
        assert renamed_record["record_id"] == first_id
        assert renamed_record["name"] == "Renamed locally"
        assert renamed_record["media_content_id"] == reference
        assert "entries" not in renamed_record

        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/delete_provider",
                "record_id": first_id,
                "revision": renamed["result"]["revision"],
            }
        )
        removed = await websocket.receive_json()
        assert removed["success"] is True
        assert [record["record_id"] for record in removed["result"]["records"]] == [
            distinct["result"]["records"][1]["record_id"],
            custom_id,
        ]
        assert removed["result"]["records"][1]["entries"] == [_media_entry()]


@pytest.mark.parametrize(
    "reference",
    [
        "https://provider.test/playlist?token=URL_SECRET_SENTINEL",
        "media-source://provider/list?%61ccess_token=TOKEN_SECRET_SENTINEL",
        "media-source://provider/list?%2574oken=ENCODED_SECRET_SENTINEL",
    ],
)
async def test_playlist_library_provider_redaction_rejects_urls_and_credentials(
    hass, hass_ws_client, socket_enabled, tmp_path, reference, caplog
):
    hass.config.config_dir = str(tmp_path)
    await async_setup_component(hass, "websocket_api", {})
    await async_setup_playlist_library(hass, {})

    async with await hass_ws_client() as websocket:
        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/save_provider",
                "media_content_id": reference,
                "name": "Rejected reference",
            }
        )
        rejected = await websocket.receive_json()
        assert rejected["success"] is False
        assert len(rejected["error"]["message"]) <= 128
        integration_logs = "\n".join(
            record.getMessage()
            for record in caplog.records
            if record.name.startswith("custom_components.bl_haos")
        )
        assert "SECRET_SENTINEL" not in repr(rejected) + integration_logs

        await websocket.send_json_auto_id({"type": "bl_haos/playlist_library/list"})
        listed = await websocket.receive_json()
        assert listed["success"] is True
        assert listed["result"]["records"] == []


async def test_playlist_library_provider_allowlist_rejects_track_expansion_fields(
    hass, hass_ws_client, socket_enabled, tmp_path
):
    hass.config.config_dir = str(tmp_path)
    await async_setup_component(hass, "websocket_api", {})
    await async_setup_playlist_library(hass, {})

    async with await hass_ws_client() as websocket:
        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/save_provider",
                "media_content_id": "media-source://provider/list",
                "name": "Reference only",
                "entries": [_media_entry()],
                "provider_error": "RAW_PROVIDER_ERROR_SENTINEL",
            }
        )
        rejected = await websocket.receive_json()
        assert rejected["success"] is False
        assert rejected["error"]["code"] == "invalid_format"
        assert "RAW_PROVIDER_ERROR_SENTINEL" not in repr(rejected)
        await websocket.send_json_auto_id({"type": "bl_haos/playlist_library/list"})
        listed = await websocket.receive_json()
        assert listed["result"]["records"] == []


async def test_playlist_library_provider_allowlist_enforces_shared_field_bounds(hass, tmp_path):
    hass.config.config_dir = str(tmp_path)
    await async_setup_playlist_library(hass, {})
    library = hass.data[LIBRARY_DATA]
    saved = await library.async_save_provider(
        "media-source://provider/saved", "Baseline", {"title": "Saved title"}
    )
    invalid = [
        (
            "media-source://provider/long-name",
            "n" * (MAX_NAME_BYTES + 1),
            {},
        ),
        (
            "media-source://provider/long-title",
            "Long title",
            {"title": "t" * (MAX_TITLE_BYTES + 1)},
        ),
        (
            "media-source://provider/long-class",
            "Long class",
            {"media_class": "c" * (MAX_MEDIA_CLASS_BYTES + 1)},
        ),
        (
            "media-source://provider/long-content-type",
            "Long content type",
            {"media_content_type": "c" * (MAX_CONTENT_TYPE_BYTES + 1)},
        ),
        (
            "media-source://provider/" + "x" * MAX_MEDIA_ID_BYTES,
            "Long ID",
            {},
        ),
        (
            "media-source://provider/error-field",
            "Error field",
            {"provider_error": "RAW_PROVIDER_ERROR_SENTINEL"},
        ),
    ]

    for reference, name, metadata in invalid:
        with pytest.raises(PlaylistLibraryValidationError) as error:
            await library.async_save_provider(reference, name, metadata)
        assert "RAW_PROVIDER_ERROR_SENTINEL" not in str(error.value)
        assert await Store(hass, 1, LIBRARY_STORE_KEY, atomic_writes=True).async_load() == saved


async def test_playlist_library_provider_shortcuts_obey_record_limit(hass, tmp_path):
    hass.config.config_dir = str(tmp_path)
    await async_setup_playlist_library(hass, {})
    library = hass.data[LIBRARY_DATA]

    for index in range(MAX_RECORDS):
        result = await library.async_save_provider(
            f"media-source://provider/playlist-{index}", f"Playlist {index}", {}
        )
    saved = await Store(hass, 1, LIBRARY_STORE_KEY, atomic_writes=True).async_load()
    assert len(result["records"]) == MAX_RECORDS
    assert len(saved["records"]) == MAX_RECORDS

    with pytest.raises(PlaylistLibraryValidationError):
        await library.async_save_provider(
            "media-source://provider/over-limit", "Over limit", {}
        )
    assert await Store(hass, 1, LIBRARY_STORE_KEY, atomic_writes=True).async_load() == saved


async def test_playlist_library_provider_shortcuts_obey_aggregate_byte_limit(hass, tmp_path):
    hass.config.config_dir = str(tmp_path)
    await async_setup_playlist_library(hass, {})
    prefix = "media-source://provider/"
    short_id = prefix + "x"
    long_id = prefix + "x" * (MAX_MEDIA_ID_BYTES - len(prefix))
    entry_count = MAX_RECORDS * 10
    records = [
        {
            "record_id": f"{index + 1:08x}-1111-4111-8111-{index + 1:012x}",
            "record_revision": 1,
            "kind": "custom",
            "name": f"Record {index}",
            "entries": [],
        }
        for index in range(4)
    ]
    entry_delta = len(long_id) - len(short_id)
    base_document = {
        "schema_version": 2,
        "revision": 1,
        "records": records,
    }
    for record in records:
        record["entries"] = [
            {"media_content_id": short_id, "title": "t" * 256}
            for _ in range(entry_count // len(records))
        ]
    base_size = len(json.dumps(base_document, separators=(",", ":")).encode("utf-8"))
    long_entries = (MAX_LIBRARY_BYTES - base_size) // entry_delta
    remaining = MAX_LIBRARY_BYTES - (base_size + long_entries * entry_delta)
    flat_entries = [entry for record in records for entry in record["entries"]]
    for entry in flat_entries[:long_entries]:
        entry["media_content_id"] = long_id
    if remaining:
        flat_entries[long_entries]["media_content_id"] = prefix + "x" * (
            len(short_id) - len(prefix) + remaining - 1
        )
    baseline = {
        "schema_version": 2,
        "revision": 1,
        "records": records,
    }
    serialized = json.dumps(
        baseline, ensure_ascii=False, allow_nan=False, separators=(",", ":")
    ).encode("utf-8")
    assert len(serialized) == MAX_LIBRARY_BYTES - 1

    await Store(hass, 1, LIBRARY_STORE_KEY, atomic_writes=True).async_save(baseline)
    library = PlaylistLibrary(hass)
    assert await library.async_list() == baseline
    with pytest.raises(PlaylistLibraryValidationError):
        await library.async_save_provider(
            "media-source://provider/new-playlist", "New shortcut", {}
        )
    assert await Store(hass, 1, LIBRARY_STORE_KEY, atomic_writes=True).async_load() == baseline


@pytest.mark.parametrize(
    "name,entries",
    [
        ("n" * 129, []),
        ("Too many entries", [_media_entry()] * 251),
        ("Long media ID", [_media_entry("media-source://p/" + "x" * 2033)]),
        ("Long title", [{**_media_entry(), "title": "t" * 257}]),
        ("Long media class", [{**_media_entry(), "media_class": "c" * 129}]),
        ("Long content type", [{**_media_entry(), "media_content_type": "c" * 129}]),
        ("Raw playback URL", [_media_entry("https://provider.test/audio?token=secret")]),
        ("Credential query", [_media_entry("media-source://p/item?ACCESS_TOKEN=secret")]),
        ("Encoded credential query", [_media_entry("media-source://p/item?%2574oken=secret")]),
        ("Unapproved URL field", [{**_media_entry(), "resolved_url": "https://secret.test/stream"}]),
        ("Credential field", [{**_media_entry(), "credential": "CREDENTIAL_SENTINEL"}]),
        ("Thumbnail URL", [{**_media_entry(), "thumbnail_url": "https://secret.test/cover"}]),
        ("Provider error", [{**_media_entry(), "provider_error": "RAW_PROVIDER_EXCEPTION_SENTINEL"}]),
    ],
)
async def test_playlist_library_validation_rejects_invalid_mutation_without_replacing_data(
    hass, tmp_path, name, entries, caplog
):
    hass.config.config_dir = str(tmp_path)
    await async_setup_playlist_library(hass, {})
    library = hass.data[LIBRARY_DATA]
    saved = await library.async_save_custom(
        "a1111111-1111-4111-8111-111111111111", "Baseline", [], 0
    )

    with pytest.raises(PlaylistLibraryValidationError) as error:
        await library.async_save_custom(
            "b2222222-2222-4222-8222-222222222222", name, entries, saved["revision"]
        )

    persisted = await Store(hass, 1, LIBRARY_STORE_KEY, atomic_writes=True).async_load()
    assert persisted == saved
    assert "CREDENTIAL_SENTINEL" not in str(error.value) + caplog.text
    assert "RAW_PROVIDER_EXCEPTION_SENTINEL" not in str(error.value) + caplog.text


async def test_playlist_library_validation_accepts_exact_field_and_entry_bounds(hass, tmp_path):
    hass.config.config_dir = str(tmp_path)
    await async_setup_playlist_library(hass, {})
    library = hass.data[LIBRARY_DATA]
    exact_entry = _media_entry("media-source://p/" + "x" * 2031)
    exact_entry["title"] = "t" * 256
    exact_entry["media_class"] = "c" * 128
    exact_entry["media_content_type"] = "m" * 128
    entries = [exact_entry.copy() for _ in range(250)]

    result = await library.async_save_custom(
        "c3333333-3333-4333-8333-333333333333", "n" * 128, entries, 0
    )

    record = result["records"][0]
    assert record["name"] == "n" * 128
    assert len(record["entries"]) == 250
    assert record["entries"][0] == exact_entry


async def test_playlist_library_concurrent_independent_updates_and_stale_revision(hass, tmp_path):
    hass.config.config_dir = str(tmp_path)
    await async_setup_playlist_library(hass, {})
    library = hass.data[LIBRARY_DATA]
    first_id = "d4444444-4444-4444-8444-444444444444"
    second_id = "e5555555-5555-4555-8555-555555555555"

    await asyncio.gather(
        library.async_save_custom(first_id, "First", [_media_entry()], 0),
        library.async_save_custom(second_id, "Second", [_media_entry()], 0),
    )
    current = await library.async_list()
    assert {record["record_id"] for record in current["records"]} == {first_id, second_id}

    first = next(record for record in current["records"] if record["record_id"] == first_id)
    await library.async_save_custom(first_id, "First edited", [_media_entry()], current["revision"])
    edited = await library.async_list()
    saved_first = next(record for record in edited["records"] if record["record_id"] == first_id)
    assert saved_first["name"] == "First edited"

    with pytest.raises(PlaylistLibraryConflictError):
        await library.async_save_custom(first_id, "Stale overwrite", [], first["record_revision"])

    after_conflict = await library.async_list()
    retained_first = next(record for record in after_conflict["records"] if record["record_id"] == first_id)
    assert retained_first == saved_first
    assert [record["record_id"] for record in after_conflict["records"]] == [first_id, second_id]


async def test_playlist_library_migration_is_repeatable_and_preserves_reference_order(hass, tmp_path):
    hass.config.config_dir = str(tmp_path)
    legacy = {
        "revision": 4,
        "records": [
            {
                "record_id": "f6666666-6666-4666-8666-666666666666",
                "kind": "custom",
                "name": "Legacy order",
                "entries": [
                    _media_entry("media-source://provider/first%2Fopaque"),
                    _media_entry("media-source://provider/second?order=a%2Bb"),
                ],
            }
        ],
    }
    await Store(hass, 1, LIBRARY_STORE_KEY, atomic_writes=True).async_save(legacy)
    migrated = await PlaylistLibrary(hass).async_list()
    path = Path(PlaylistLibrary(hass).store.path)
    migrated_bytes = path.read_bytes()

    assert migrated["schema_version"] == 2
    assert migrated["records"][0]["record_revision"] == 4
    assert [entry["media_content_id"] for entry in migrated["records"][0]["entries"]] == [
        "media-source://provider/first%2Fopaque",
        "media-source://provider/second?order=a%2Bb",
    ]
    assert await PlaylistLibrary(hass).async_list() == migrated
    assert path.read_bytes() == migrated_bytes


@pytest.mark.parametrize("load_failure", [None, OSError("storage sentinel")])
async def test_playlist_library_corruption_fails_closed_and_preserves_existing_file(
    hass, tmp_path, load_failure
):
    hass.config.config_dir = str(tmp_path)
    await async_setup_playlist_library(hass, {})
    library = hass.data[LIBRARY_DATA]
    path = Path(library.store.path)
    path.parent.mkdir(parents=True, exist_ok=True)
    original = b"preserve the existing playlist store"
    path.write_bytes(original)
    unreadable = patch.object(library.store, "async_load", side_effect=load_failure) if load_failure else patch.object(
        library.store, "async_load", return_value=None
    )

    with unreadable, pytest.raises(PlaylistLibraryStorageError):
        await library.async_list()

    assert path.read_bytes() == original
    with pytest.raises(PlaylistLibraryStorageError):
        await library.async_save_custom(
            "a7777777-7777-4777-8777-777777777777", "Must remain disabled", [], 0
        )


async def test_playlist_library_unsupported_schema_is_preserved_and_not_empty(hass, tmp_path):
    hass.config.config_dir = str(tmp_path)
    future = {"schema_version": 99, "revision": 7, "records": []}
    store = Store(hass, 1, LIBRARY_STORE_KEY, atomic_writes=True)
    await store.async_save(future)
    original = Path(store.path).read_bytes()

    with pytest.raises(PlaylistLibraryStorageError):
        await PlaylistLibrary(hass).async_list()

    assert Path(store.path).read_bytes() == original


async def test_playlist_library_corrupt_core_store_quarantine_fails_closed(hass, tmp_path):
    hass.config.config_dir = str(tmp_path)
    await async_setup_playlist_library(hass, {})
    library = hass.data[LIBRARY_DATA]
    path = Path(library.store.path)
    path.parent.mkdir(parents=True, exist_ok=True)
    corrupted = b"{ definitely not valid json"
    path.write_bytes(corrupted)

    with pytest.raises(PlaylistLibraryStorageError):
        await library.async_list()

    preserved_paths = (path, *path.parent.glob(f"{path.name}.corrupt.*"))
    assert any(candidate.is_file() and candidate.read_bytes() == corrupted for candidate in preserved_paths)
    fresh_library = PlaylistLibrary(hass)
    with pytest.raises(PlaylistLibraryStorageError):
        await fresh_library.async_list()
    with pytest.raises(PlaylistLibraryStorageError):
        await fresh_library.async_save_custom(
            "b7777777-7777-4777-8777-777777777777", "Must remain disabled", [], 0
        )
    with pytest.raises(PlaylistLibraryStorageError):
        await library.async_save_custom(
            "b7777777-7777-4777-8777-777777777777", "Must remain disabled", [], 0
        )


async def test_playlist_library_future_core_store_version_is_preserved(hass, tmp_path):
    hass.config.config_dir = str(tmp_path)
    future_store = Store(hass, 2, LIBRARY_STORE_KEY, atomic_writes=True)
    await future_store.async_save({"schema_version": 3, "revision": 9, "records": []})
    original = Path(future_store.path).read_bytes()

    with pytest.raises(PlaylistLibraryStorageError):
        await PlaylistLibrary(hass).async_list()

    assert Path(future_store.path).read_bytes() == original


async def test_playlist_library_validation_rejects_full_reference_credentials_and_extra_fields(hass, tmp_path):
    hass.config.config_dir = str(tmp_path)
    await async_setup_playlist_library(hass, {})
    library = hass.data[LIBRARY_DATA]
    accepted_reference = "media-source://provider/opaque%2Fid?order=a%2Bb"
    saved = await library.async_save_custom(
        "a8888888-8888-4888-8888-888888888888", "Opaque", [_media_entry(accepted_reference)], 0
    )
    assert saved["records"][0]["entries"][0]["media_content_id"] == accepted_reference

    invalid_references = [
        "https://provider.test/audio",
        "media-source://provider/item?access_token=secret",
        "media-source://provider/item?Api_Key=secret",
        "media-source://provider/item?%61uthorization=secret",
        "media-source://provider/item?%2574oken=secret",
    ]
    for index, media_id in enumerate(invalid_references, start=1):
        with pytest.raises(PlaylistLibraryValidationError):
            await library.async_save_custom(
                f"b9999999-9999-4999-8999-{index:012d}",
                "Credential test",
                [_media_entry(media_id)],
                saved["revision"],
            )

    with pytest.raises(PlaylistLibraryValidationError):
        await library.async_save_custom(
            "caaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
            "Provider error sentinel",
            [{**_media_entry(), "provider_error": "RAW_PROVIDER_EXCEPTION_SENTINEL"}],
            saved["revision"],
        )

    persisted = await Store(hass, 1, LIBRARY_STORE_KEY, atomic_writes=True).async_load()
    serialized = repr(persisted)
    assert "RAW_PROVIDER_EXCEPTION_SENTINEL" not in serialized
    assert persisted["records"][0]["entries"][0]["media_content_id"] == accepted_reference


async def test_playlist_library_authenticated_users_share_access_and_anonymous_is_rejected(
    hass, hass_ws_client, aiohttp_client, socket_enabled, tmp_path
):
    hass.config.config_dir = str(tmp_path)
    await async_setup_component(hass, "websocket_api", {})
    await async_setup_playlist_library(hass, {})
    second_user = await hass.auth.async_create_user("playlist library editor")
    second_refresh_token = await hass.auth.async_create_refresh_token(
        second_user, client_id="playlist_library_sil", client_name="playlist library SIL"
    )
    second_access_token = hass.auth.async_create_access_token(second_refresh_token)
    record_id = "d1111111-1111-4111-8111-111111111111"

    async with (
        await hass_ws_client() as owner_socket,
        await hass_ws_client(access_token=second_access_token) as user_socket,
    ):
        await owner_socket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/save_custom",
                "record_id": record_id,
                "name": "Shared library",
                "entries": [_media_entry()],
                "revision": 0,
            }
        )
        created = await owner_socket.receive_json()
        assert created["success"] is True

        await user_socket.send_json_auto_id({"type": "bl_haos/playlist_library/list"})
        shared = await user_socket.receive_json()
        assert shared["success"] is True
        assert shared["result"] == created["result"]

        await user_socket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/save_custom",
                "record_id": record_id,
                "name": "Edited by another user",
                "entries": [_media_entry()],
                "revision": shared["result"]["revision"],
            }
        )
        edited = await user_socket.receive_json()
        assert edited["success"] is True

        await owner_socket.send_json_auto_id({"type": "bl_haos/playlist_library/list"})
        owner_readback = await owner_socket.receive_json()
        assert owner_readback["result"] == edited["result"]

    http_client = await aiohttp_client(hass.http.app)
    anonymous_socket = await http_client.ws_connect("/api/websocket")
    auth_required = await anonymous_socket.receive_json()
    assert auth_required["type"] == "auth_required"
    await anonymous_socket.send_json({"type": "auth", "access_token": "invalid"})
    auth_rejected = await anonymous_socket.receive_json()
    assert auth_rejected["type"] == "auth_invalid"
    close_message = await anonymous_socket.receive()
    assert close_message.type in {aiohttp.WSMsgType.CLOSE, aiohttp.WSMsgType.CLOSED}
    await anonymous_socket.close()
    await http_client.server.close()
    await http_client.close()
    await asyncio.sleep(0)


async def test_playlist_library_authenticated_custom_update_reorder_delete(hass, hass_ws_client, socket_enabled, tmp_path):
    hass.config.config_dir = str(tmp_path)
    await async_setup_component(hass, "websocket_api", {})
    await async_setup_playlist_library(hass, {})
    record_id = "a7777777-7777-4777-8777-777777777777"
    first_reference = "media-source://provider/first%2Fopaque"
    second_reference = "media-source://provider/second?order=a%2Bb"

    async with await hass_ws_client() as websocket:
        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/save_custom",
                "record_id": record_id,
                "name": "Ordered",
                "entries": [_media_entry(first_reference), _media_entry(second_reference)],
                "revision": 0,
            }
        )
        created = await websocket.receive_json()
        assert created["success"] is True

        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/save_custom",
                "record_id": record_id,
                "name": "Reordered",
                "entries": [_media_entry(second_reference), _media_entry(first_reference)],
                "revision": created["result"]["revision"],
            }
        )
        updated = await websocket.receive_json()
        assert updated["success"] is True
        updated_record = updated["result"]["records"][0]
        assert updated_record["record_id"] == record_id
        assert updated_record["name"] == "Reordered"
        assert [entry["media_content_id"] for entry in updated_record["entries"]] == [
            second_reference,
            first_reference,
        ]

        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/delete_custom",
                "record_id": record_id,
                "revision": updated["result"]["revision"],
            }
        )
        deleted = await websocket.receive_json()
        assert deleted["success"] is True
        assert deleted["result"]["records"] == []


async def test_playlist_library_custom_update_preserves_identity_order_duplicates_and_revision(
    hass, hass_ws_client, socket_enabled, tmp_path
):
    hass.config.config_dir = str(tmp_path)
    await async_setup_component(hass, "websocket_api", {})
    await async_setup_playlist_library(hass, {})
    record_id = "a8888888-8888-4888-8888-888888888888"
    first = _media_entry("media-source://provider/first%2Fopaque")
    second = _media_entry("media-source://provider/second?order=a%2Bb")

    async with await hass_ws_client() as websocket:
        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/save_custom",
                "record_id": record_id,
                "name": "Before edit",
                "entries": [first, second, first],
                "revision": 0,
            }
        )
        created = await websocket.receive_json()
        assert created["success"] is True

        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/update_custom",
                "record_id": record_id,
                "name": "After edit",
                "entries": [second, first, second],
                "revision": created["result"]["revision"],
            }
        )
        updated = await websocket.receive_json()
        assert updated["success"] is True, updated
        updated_record = updated["result"]["records"][0]
        assert updated_record["record_id"] == record_id
        assert updated_record["record_revision"] == 2
        assert updated_record["name"] == "After edit"
        assert updated_record["entries"] == [second, first, second]

        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/update_custom",
                "record_id": record_id,
                "name": "Stale edit",
                "entries": [],
                "revision": created["result"]["revision"],
            }
        )
        stale = await websocket.receive_json()
        assert stale["success"] is False
        assert len(stale["error"]["message"]) <= 128
        await websocket.send_json_auto_id({"type": "bl_haos/playlist_library/list"})
        readback = await websocket.receive_json()
        assert readback["result"] == updated["result"]


async def test_playlist_library_custom_delete_not_found_and_provider_isolation(
    hass, hass_ws_client, socket_enabled, tmp_path
):
    hass.config.config_dir = str(tmp_path)
    await async_setup_component(hass, "websocket_api", {})
    await async_setup_playlist_library(hass, {})
    custom_id = "b9999999-9999-4999-8999-999999999999"

    async with await hass_ws_client() as websocket:
        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/save_custom",
                "record_id": custom_id,
                "name": "Keep custom",
                "entries": [],
                "revision": 0,
            }
        )
        custom = await websocket.receive_json()
        assert custom["success"] is True
        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/save_provider",
                "media_content_id": "media-source://provider/keep%2Fopaque",
                "name": "Keep provider",
            }
        )
        mixed = await websocket.receive_json()
        assert mixed["success"] is True
        before_delete = mixed["result"]
        provider_id = before_delete["records"][1]["record_id"]
        unknown_id = "caaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"

        for missing_id in (
            unknown_id,
            provider_id,
        ):
            await websocket.send_json_auto_id(
                {
                    "type": "bl_haos/playlist_library/delete_custom",
                    "record_id": missing_id,
                    "revision": before_delete["revision"],
                }
            )
            missing = await websocket.receive_json()
            assert missing["success"] is False
            assert missing["error"]["code"] == "not_found"
            assert len(missing["error"]["message"]) <= 128

        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/update_custom",
                "record_id": unknown_id,
                "name": "Must not create",
                "entries": [],
                "revision": before_delete["revision"],
            }
        )
        unknown_update = await websocket.receive_json()
        assert unknown_update["success"] is False
        assert unknown_update["error"]["code"] == "not_found"

        await websocket.send_json_auto_id({"type": "bl_haos/playlist_library/list"})
        unchanged = await websocket.receive_json()
        assert unchanged["result"] == before_delete

        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/delete_custom",
                "record_id": custom_id,
                "revision": before_delete["revision"],
            }
        )
        deleted = await websocket.receive_json()
        assert deleted["success"] is True
        assert [record["record_id"] for record in deleted["result"]["records"]] == [provider_id]


@pytest.mark.parametrize("failure_mode", ["write_error", "missing_readback"])
async def test_playlist_library_storage_failure_disables_writes_until_reload(
    hass, hass_ws_client, socket_enabled, tmp_path, failure_mode, caplog
):
    hass.config.config_dir = str(tmp_path)
    await async_setup_component(hass, "websocket_api", {})
    await async_setup_playlist_library(hass, {})
    library = hass.data[LIBRARY_DATA]
    record_id = "e2222222-2222-4222-8222-222222222222"

    async with await hass_ws_client() as websocket:
        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/save_custom",
                "record_id": record_id,
                "name": "Before failure",
                "entries": [],
                "revision": 0,
            }
        )
        created = await websocket.receive_json()
        assert created["success"] is True
        storage_path = Path(library.store.path)
        before_failure = storage_path.read_bytes()

        if failure_mode == "write_error":
            save_mock = AsyncMock(side_effect=OSError("STORE_WRITE_SENTINEL"))
        else:
            save_mock = AsyncMock(return_value=None)
        with patch.object(library.store, "async_save", new=save_mock):
            await websocket.send_json_auto_id(
                {
                    "type": "bl_haos/playlist_library/save_custom",
                    "record_id": "f3333333-3333-4333-8333-333333333333",
                    "name": "Must not claim success",
                    "entries": [],
                    "revision": created["result"]["revision"],
                }
            )
            failure = await websocket.receive_json()

            assert failure["success"] is False
            assert len(failure["error"]["message"]) <= 128
            assert "STORE_WRITE_SENTINEL" not in repr(failure)
            assert "STORE_WRITE_SENTINEL" not in caplog.text
            assert storage_path.read_bytes() == before_failure

            await websocket.send_json_auto_id(
                {
                    "type": "bl_haos/playlist_library/save_custom",
                    "record_id": "a4444444-4444-4444-8444-444444444444",
                    "name": "Still disabled",
                    "entries": [],
                    "revision": created["result"]["revision"],
                }
            )
            disabled = await websocket.receive_json()
            assert disabled["success"] is False

        recovered = await library.async_reload()
        assert recovered == created["result"]
        await websocket.send_json_auto_id(
            {
                "type": "bl_haos/playlist_library/save_custom",
                "record_id": "b5555555-5555-4555-8555-555555555555",
                "name": "After reload",
                "entries": [],
                "revision": recovered["revision"],
            }
        )
        after_reload = await websocket.receive_json()
        assert after_reload["success"] is True


async def test_playlist_library_schema_rejects_malformed_requests_before_mutation(
    hass, hass_ws_client, socket_enabled, tmp_path
):
    hass.config.config_dir = str(tmp_path)
    await async_setup_component(hass, "websocket_api", {})
    await async_setup_playlist_library(hass, {})
    library = hass.data[LIBRARY_DATA]
    baseline = await library.async_save_custom(
        "c6666666-6666-4666-8666-666666666666", "Baseline", [], 0
    )
    valid = {
        "type": "bl_haos/playlist_library/save_custom",
        "record_id": "d7777777-7777-4777-8777-777777777777",
        "name": "Schema probe",
        "entries": [],
        "revision": 0,
    }
    malformed = [
        {key: value for key, value in valid.items() if key != "name"},
        {key: value for key, value in valid.items() if key != "revision"},
        {**valid, "entries": [{}]},
        {**valid, "entries": [{**_media_entry(), "resolved_url": "https://secret.test/stream"}]},
        {**valid, "entries": "not-a-list"},
        {**valid, "unexpected": "extra"},
        {
            "type": "bl_haos/playlist_library/delete_custom",
            "record_id": baseline["records"][0]["record_id"],
        },
        {
            "type": "bl_haos/playlist_library/delete_custom",
            "revision": baseline["revision"],
        },
        {
            "type": "bl_haos/playlist_library/delete_custom",
            "record_id": baseline["records"][0]["record_id"],
            "revision": baseline["revision"],
            "unexpected": True,
        },
    ]

    async with await hass_ws_client() as websocket:
        for request in malformed:
            await websocket.send_json_auto_id(request.copy())
            response = await websocket.receive_json()
            assert response["success"] is False
            assert response["error"]["code"] == "invalid_format"
            assert len(response["error"]["message"]) <= 128

    assert await Store(hass, 1, LIBRARY_STORE_KEY, atomic_writes=True).async_load() == baseline


async def test_playlist_library_availability_browses_exact_saved_references_without_resolution(
    hass, hass_ws_client, socket_enabled, tmp_path
):
    hass.config.config_dir = str(tmp_path)
    await async_setup_component(hass, "websocket_api", {})
    await async_setup_component(hass, "media_source", {})
    source = _SyntheticAvailabilitySource()
    hass.data[DATA_MEDIA_SOURCE_PLATFORMS] = _SyntheticAvailabilityPlatforms(source)
    await async_setup_playlist_library(hass, {})
    library = hass.data[LIBRARY_DATA]
    custom_reference = (
        "media-source://bl_haos_availability_probe/custom%2Fopaque?order=a%2Bb"
    )
    provider_reference = (
        "media-source://bl_haos_availability_probe/denied%2Fopaque?order=c%2Bd"
    )
    await library.async_save_custom(
        "a1111111-1111-4111-8111-111111111111",
        "Custom playlist",
        [_media_entry(custom_reference)],
        0,
    )
    await library.async_save_provider(provider_reference, "Saved provider playlist", {})
    store_path = Path(library.store.path)
    before_bytes = store_path.read_bytes()
    before_document = await library.async_list()
    custom_record, provider_record = before_document["records"]

    results_by_record: dict[str, str] = {}
    with patch.object(type(hass.services), "async_call", autospec=True) as service_call:
        async with await hass_ws_client() as websocket:
            for record_id, reference in (
                (custom_record["record_id"], custom_reference),
                (provider_record["record_id"], provider_reference),
            ):
                await websocket.send_json_auto_id(
                    {
                        "type": "media_source/browse_media",
                        "media_content_id": reference,
                    }
                )
                response = await websocket.receive_json()
                if response["success"]:
                    results_by_record[record_id] = "Available"
                    assert response["result"]["can_play"] is False
                else:
                    results_by_record[record_id] = "Unavailable in Home Assistant"
                    assert response["error"]["code"] == "browse_media_failed"

    assert results_by_record == {
        custom_record["record_id"]: "Available",
        provider_record["record_id"]: "Unavailable in Home Assistant",
    }
    assert source.browse_calls == [custom_reference, provider_reference]
    assert source.resolve_calls == []
    service_call.assert_not_awaited()
    assert store_path.read_bytes() == before_bytes
    persisted = await Store(hass, 1, LIBRARY_STORE_KEY, atomic_writes=True).async_load()
    assert persisted == before_document
    assert [record["record_id"] for record in persisted["records"]] == [
        custom_record["record_id"],
        provider_record["record_id"],
    ]
    assert persisted["records"][0]["entries"] == [_media_entry(custom_reference)]
    assert persisted["records"][1]["media_content_id"] == provider_reference