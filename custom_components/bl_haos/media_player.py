"""Native Home Assistant media players backed by the BL-HAOS bridge."""

from __future__ import annotations

import re
from collections.abc import Callable
from copy import copy
from datetime import datetime, timezone
from typing import Any
from urllib.parse import urlsplit

import aiohttp
from homeassistant.components.media_player import (
    BrowseMedia,
    MediaClass,
    MediaPlayerDeviceClass,
    MediaPlayerEntity,
    MediaPlayerEntityFeature,
    MediaPlayerState,
    RepeatMode,
    async_process_play_media_url,
)
from homeassistant.components.media_source import (
    async_browse_media,
    async_resolve_media,
    is_media_source_id,
)
from homeassistant.exceptions import HomeAssistantError
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.network import get_url

from .client import BLHAOSClient, normalize_address
from .const import (
    AUTH_FAILURE_MARKER,
    COMMAND_PAUSE,
    COMMAND_PLAY,
    COMMAND_PLAY_MEDIA,
    COMMAND_SET_VOLUME,
    COMMAND_STOP,
    CONNECTION_DROPPED_MARKER,
    DEVICE_MODEL,
    DOMAIN,
    MANUFACTURER,
    MEDIA_PLAYER_DOMAIN,
    MEDIA_TYPE_MAX_LENGTH,
    MAX_QUEUE_ITEMS,
    MAX_QUEUE_PAYLOAD_BYTES,
    MAX_QUEUE_TEXT_LENGTH,
    MAX_QUEUE_URL_LENGTH,
    NATIVE_QUEUE_VERSION,
    NO_ACTIVE_PLAYBACK_MARKER,
    PAYLOAD_ADAPTER_KEY,
    PAYLOAD_ARTIST_KEY,
    PAYLOAD_AVAILABLE_KEY,
    PAYLOAD_CONNECTED_KEY,
    PAYLOAD_DURATION_KEY,
    PAYLOAD_NAME_KEY,
    PAYLOAD_PLAYBACK_KEY,
    PAYLOAD_POSITION_KEY,
    PAYLOAD_POSITION_UPDATED_AT_KEY,
    PAYLOAD_QUEUE_KEY,
    PAYLOAD_QUEUE_VERSION_KEY,
    PAYLOAD_STATE_KEY,
    PAYLOAD_TITLE_KEY,
    PAYLOAD_VOLUME_KEY,
    UNTRUSTED_SINK_MARKER,
    QUEUE_NEXT,
    QUEUE_PREVIOUS,
    QUEUE_SET_REPEAT,
    QUEUE_SET_SHUFFLE,
    QUEUE_START,
    get_logger,
)
from .speaker_policy import ENTITY_DISABLED, ENTITY_REMOVED, desired_entity_state

from .call_trace import trace_call

_LOGGER = get_logger(__name__)

# Home Assistant content types ("music", "video", "audio/mpeg", "channel") and
# MIME types both fit this bounded, structurally safe token shape. The value is
# only informational for the bridge — ffmpeg sniffs the real stream — so pass it
# through and drop anything that does not fit instead of failing playback.
_MEDIA_TYPE_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9!#$&^_.+-]*(?:/[A-Za-z0-9!#$&^_.+-]+)?$")


@trace_call
def _queue_display_value(value: object) -> str | None:
    if not isinstance(value, str):
        return None
    cleaned = value.strip()
    if not cleaned or "://" in cleaned or any(ord(character) < 32 or 127 <= ord(character) <= 159 for character in cleaned):
        return None
    return cleaned[:MAX_QUEUE_TEXT_LENGTH]


@trace_call
def _filter_audio_browse(item: BrowseMedia) -> BrowseMedia | None:
    """Keep audio/playlist metadata and traversable provider hierarchy intact."""
    audio_classes = {
        MediaClass.ALBUM, MediaClass.ARTIST, MediaClass.COMPOSER,
        MediaClass.CONTRIBUTING_ARTIST, MediaClass.GENRE, MediaClass.MUSIC,
        MediaClass.PODCAST, MediaClass.TRACK,
    }
    supported = (
        item.media_class == MediaClass.PLAYLIST
        or item.media_content_type == "playlist"
        or item.can_play and (
            item.media_class in audio_classes
            or item.media_content_type in audio_classes
            or item.media_content_type.startswith("audio/")
        )
    )
    if not item.can_expand and not supported:
        return None
    filtered = copy(item)
    if item.children is not None:
        filtered.children = [
            child for original in item.children
            if (child := _filter_audio_browse(original)) is not None
        ]
    return filtered


@trace_call
def _normalize_media_type(media_type: str | None) -> str | None:
    """Return a safe media-type token for the bridge, or None when unusable."""
    if not media_type or not isinstance(media_type, str):
        return None
    candidate = media_type.strip()
    if not candidate or len(candidate) > MEDIA_TYPE_MAX_LENGTH or not _MEDIA_TYPE_PATTERN.fullmatch(candidate):
        return None
    return candidate.lower()


@trace_call
def entity_unique_id(address: str) -> str:
    """Return the entity-registry unique id of one speaker's media player."""
    return f"{DOMAIN}_{address.replace(':', '')}"


@trace_call
async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: Callable,
) -> None:
    """Set up cached BL-HAOS speakers and subscribe for native updates."""
    client: BLHAOSClient = entry.runtime_data.client
    speakers: dict[str, BLHAOSMediaPlayer] = {}
    registry = er.async_get(hass)
    _LOGGER.debug(
        "Setting up BL-HAOS media player platform for entry %s (%d initial speakers: %s)",
        entry.entry_id,
        len(client.speakers),
        list(client.speakers.keys()),
    )

    @trace_call
    def _registered_entity_id(address: str) -> str | None:
        """Return the entity id Home Assistant registered for one speaker."""
        return registry.async_get_entity_id(MEDIA_PLAYER_DOMAIN, DOMAIN, entity_unique_id(address))

    @trace_call
    def _add_speaker(address: str) -> None:
        """Add, or refresh, the entity of a speaker that belongs in Home Assistant."""
        entity_id = _registered_entity_id(address)
        registered = registry.async_get(entity_id) if entity_id is not None else None
        if registered is not None and registered.disabled_by == er.RegistryEntryDisabler.INTEGRATION:
            # Home Assistant drops an entity from the platform as soon as its
            # registry entry is disabled and never brings it back by itself, so
            # clearing the flag here is what makes the entity reappear.
            _LOGGER.debug("Enabling media player entity %s (speaker is connected)", entity_id)
            registry.async_update_entity(entity_id, disabled_by=None)
        entity = speakers.get(address)
        if entity is not None and registered is not None and registered.disabled_by is not None:
            # The operator disabled this entity themselves. Home Assistant removed
            # it from the platform, so the cached object is stale - writing a state
            # for it would be exactly the "triggered for updates while it is
            # disabled" bug. It is rebuilt if the entity is enabled again.
            speakers.pop(address, None)
            return
        if entity is not None:
            _LOGGER.debug("Updating existing media player entity for speaker %s", address)
            entity.async_write_ha_state()
            return
        entity = BLHAOSMediaPlayer(client, address)
        speakers[address] = entity
        _LOGGER.debug("Adding new media player entity for speaker %s (%s)", address, entity.name)
        async_add_entities([entity])

    @trace_call
    def _disable_speaker(address: str) -> None:
        """Disable the entity of a speaker that is paired but not connected.

        The registry entry is kept - name, identity and history survive - and
        disabled, which takes the entity out of the platform and the state
        machine. The cached entity object goes with it, because Home Assistant
        removed it: the entity is built from scratch when the speaker returns.
        """
        speakers.pop(address, None)
        entity_id = _registered_entity_id(address)
        registered = registry.async_get(entity_id) if entity_id is not None else None
        if registered is None:
            return
        if registered.disabled_by is None:
            _LOGGER.debug("Disabling media player entity %s (speaker is paired but not connected)", entity_id)
            registry.async_update_entity(entity_id, disabled_by=er.RegistryEntryDisabler.INTEGRATION)
        # The state goes with it: a disabled entity must not leave a card behind.
        hass.states.async_remove(entity_id)

    @trace_call
    def _remove_speaker(address: str) -> None:
        """Remove a speaker's entity, its state and its registry entry."""
        entity = speakers.pop(address, None)
        entity_id = entity.entity_id if entity is not None else _registered_entity_id(address)
        if entity_id is None:
            return
        _LOGGER.debug("Removing media player entity %s of speaker %s", entity_id, address)
        hass.async_create_task(_async_remove_entity(entity, entity_id))

    @trace_call
    async def _async_remove_entity(entity: BLHAOSMediaPlayer | None, entity_id: str) -> None:
        """Remove one entity completely.

        ``Entity.async_remove(force_remove=True)`` only clears the state, so the
        registry entry would stay behind as an orphan that Home Assistant shows
        again after a restart. Deleting the entry as well is what "the speaker is
        gone" has to mean.
        """
        if entity is not None:
            await entity.async_remove(force_remove=True)
        registry.async_remove(entity_id)

    @callback
    @trace_call
    def async_discover_speaker(address: str) -> None:
        speaker = client.speakers.get(address)
        if speaker is None:
            _LOGGER.debug("Removing speaker entity for evicted address %s", address)
            _remove_speaker(address)
            return
        desired = desired_entity_state(speaker)
        if desired == ENTITY_REMOVED:
            _LOGGER.debug("Speaker %s is no longer paired; removing its media player entity", address)
            _remove_speaker(address)
            return
        if desired == ENTITY_DISABLED:
            if address in speakers or _registered_entity_id(address) is not None:
                _disable_speaker(address)
            else:
                # A speaker that has not connected since this entry was set up has
                # no entity yet; it gets one when it connects.
                _LOGGER.debug("Speaker %s is paired but not connected; no entity exists yet", address)
            return
        _LOGGER.debug("Discovered / refreshed speaker %s", address)
        _add_speaker(address)

    # Seed the platform through the same policy the listener uses, so a speaker
    # that is paired but offline is disabled (or never created, if it has no
    # entity yet) exactly as it would be on the next update.
    for address in list(client.speakers):
        async_discover_speaker(address)
    entry.async_on_unload(client.async_add_listener(async_discover_speaker))


class BLHAOSMediaPlayer(MediaPlayerEntity):
    """A cached Bluetooth speaker exposed through the native bridge."""

    _attr_has_entity_name = False
    _attr_device_class = MediaPlayerDeviceClass.SPEAKER
    _attr_should_poll = False
    _attr_supported_features = (
        MediaPlayerEntityFeature.PLAY
        | MediaPlayerEntityFeature.PAUSE
        | MediaPlayerEntityFeature.STOP
        | MediaPlayerEntityFeature.VOLUME_SET
        | MediaPlayerEntityFeature.PLAY_MEDIA
        | MediaPlayerEntityFeature.BROWSE_MEDIA
    )

    @trace_call
    def __init__(self, client: BLHAOSClient, address: str) -> None:
        """Initialize a native media player for one Bluetooth speaker."""
        self._client = client
        self._address = normalize_address(address)
        self._attr_unique_id = entity_unique_id(self._address)

    @property
    @trace_call
    def _speaker(self) -> dict:
        return self._client.get_speaker(self._address) or {}

    @property
    @trace_call
    def _playback(self) -> dict:
        playback = self._speaker.get(PAYLOAD_PLAYBACK_KEY)
        return playback if isinstance(playback, dict) else {}

    @property
    @trace_call
    def supported_features(self) -> MediaPlayerEntityFeature:
        features = self._attr_supported_features
        if self._queue_supported:
            features |= (
                MediaPlayerEntityFeature.NEXT_TRACK
                | MediaPlayerEntityFeature.PREVIOUS_TRACK
                | MediaPlayerEntityFeature.SHUFFLE_SET
                | MediaPlayerEntityFeature.REPEAT_SET
            )
        return features

    @property
    @trace_call
    def _queue_supported(self) -> bool:
        version = self._speaker.get(PAYLOAD_QUEUE_VERSION_KEY)
        return type(version) is int and version == NATIVE_QUEUE_VERSION

    @property
    @trace_call
    def _queue(self) -> dict:
        queue = self._playback.get(PAYLOAD_QUEUE_KEY)
        return queue if self._queue_supported and isinstance(queue, dict) else {}

    @property
    @trace_call
    def media_playlist(self) -> str | None:
        playlist = self._queue.get("playlist")
        return playlist if isinstance(playlist, str) else None

    @property
    @trace_call
    def shuffle(self) -> bool | None:
        value = self._queue.get("shuffle")
        return value if isinstance(value, bool) else None

    @property
    @trace_call
    def repeat(self) -> RepeatMode | None:
        value = self._queue.get("repeat")
        try:
            return RepeatMode(value) if isinstance(value, str) else None
        except ValueError:
            return None

    @property
    @trace_call
    def name(self) -> str:
        return self._speaker.get(PAYLOAD_NAME_KEY, self._address)

    @property
    @trace_call
    def available(self) -> bool:
        """Bridge reachability *and* the speaker's own availability.

        The bridge keeps publishing a trusted speaker while it is switched off,
        with ``available: false``. The entity must then read as unavailable
        rather than reporting a stale state - and, unlike a removed snapshot
        entry, it stays registered so scripts, history and dashboards keep their
        identity and it recovers by itself when the speaker returns.
        """
        return self._client.transport_available and bool(self._speaker.get(PAYLOAD_AVAILABLE_KEY, True))

    @property
    @trace_call
    def state(self):
        """Return the state of the device."""
        if not self._speaker.get(PAYLOAD_CONNECTED_KEY):
            return MediaPlayerState.OFF
        bridge_state = self._playback.get(PAYLOAD_STATE_KEY, MediaPlayerState.IDLE)
        valid_states = {MediaPlayerState.IDLE, MediaPlayerState.PLAYING, MediaPlayerState.PAUSED}
        return bridge_state if bridge_state in valid_states else MediaPlayerState.IDLE

    @property
    @trace_call
    def volume_level(self) -> float | None:
        return self._playback.get(PAYLOAD_VOLUME_KEY)

    @property
    @trace_call
    def media_position(self) -> int | None:
        """Elapsed playback time so Home Assistant can draw a progress bar."""
        position = self._playback.get(PAYLOAD_POSITION_KEY)
        return int(position) if isinstance(position, (int, float)) else None

    @property
    @trace_call
    def media_position_updated_at(self) -> datetime | None:
        """Timestamp the reported position belongs to; HA extrapolates from here."""
        updated = self._playback.get(PAYLOAD_POSITION_UPDATED_AT_KEY)
        if not isinstance(updated, (int, float)):
            return None
        return datetime.fromtimestamp(updated, tz=timezone.utc)

    @property
    @trace_call
    def media_duration(self) -> int | None:
        """Total media length in seconds, once the bridge has probed it."""
        duration = self._playback.get(PAYLOAD_DURATION_KEY)
        return int(duration) if isinstance(duration, (int, float)) and duration > 0 else None

    @property
    @trace_call
    def media_title(self) -> str | None:
        """Name of the stream being played, so Home Assistant can label it."""
        title = self._playback.get(PAYLOAD_TITLE_KEY)
        return title if isinstance(title, str) and title.strip() else None

    @property
    @trace_call
    def media_artist(self) -> str | None:
        """Embedded artist tag when the media carries one."""
        artist = self._playback.get(PAYLOAD_ARTIST_KEY)
        return artist if isinstance(artist, str) and artist.strip() else None

    @property
    @trace_call
    def device_info(self) -> DeviceInfo:
        return DeviceInfo(
            identifiers={(DOMAIN, self._address)},
            name=self.name,
            manufacturer=MANUFACTURER,
            model=DEVICE_MODEL,
        )

    @property
    @trace_call
    def extra_state_attributes(self) -> dict[str, Any]:
        """Expose the physical Bluetooth address for diagnostics."""
        attributes = {
            "bluetooth_address": self._address,
            PAYLOAD_ADAPTER_KEY: self._speaker.get(PAYLOAD_ADAPTER_KEY, ""),
        }
        if self._queue:
            attributes[PAYLOAD_QUEUE_KEY] = {
                key: value
                for key, value in self._queue.items()
                if key in {
                    "status", "playlist", "title", "artist", "index", "count",
                    "shuffle", "repeat", "error", "position", "duration",
                    "position_updated_at",
                }
            }
        return attributes

    @trace_call
    async def async_added_to_hass(self) -> None:
        """Push cached state changes without entity network I/O."""
        await super().async_added_to_hass()
        self.async_on_remove(self._client.async_add_listener(self._async_speaker_updated))

    @callback
    @trace_call
    def _async_speaker_updated(self, address: str) -> None:
        if address == self._address:
            _LOGGER.debug(
                "Entity %s (%s) updating state: state=%s, volume=%s, available=%s",
                self.entity_id,
                self._address,
                self.state,
                self.volume_level,
                self.available,
            )
            self.async_write_ha_state()

    @trace_call
    async def _async_command(self, operation: str, **kwargs) -> None:
        _LOGGER.debug("Entity %s executing command: %s", self.entity_id, operation)
        try:
            await self._client.async_command(self._address, operation, **kwargs)
            _LOGGER.debug("Entity %s command %s completed successfully", self.entity_id, operation)
        except aiohttp.ClientError as error:
            message = str(error)
            if operation == COMMAND_PLAY and NO_ACTIVE_PLAYBACK_MARKER in message:
                _LOGGER.debug("Entity %s ignore 'No active playback to resume'", self.entity_id)
                return
            if AUTH_FAILURE_MARKER in message.lower():
                raise HomeAssistantError(
                    "BL-HAOS rejected the configured token; reload the integration entry to retry"
                ) from error
            if CONNECTION_DROPPED_MARKER in message:
                raise HomeAssistantError(
                    "The BL-HAOS add-on closed the connection while handling the command"
                    " (it may be restarting or updating); try the action again"
                ) from error
            if UNTRUSTED_SINK_MARKER in message:
                raise HomeAssistantError(
                    "Speaker disconnected while the command was in flight"
                ) from error
            if operation == COMMAND_PLAY_MEDIA:
                _LOGGER.debug("Entity %s command play_media failed", self.entity_id)
                raise HomeAssistantError("Failed to submit media to the speaker") from None
            _LOGGER.debug("Entity %s command %s failed: %s", self.entity_id, operation, error)
            raise HomeAssistantError(f"Failed to {operation}: {error}") from error
        except TimeoutError as error:
            _LOGGER.debug("Entity %s command %s timed out", self.entity_id, operation)
            raise HomeAssistantError(f"Timeout communicating with speaker during {operation}") from error

    @trace_call
    async def async_media_play(self) -> None:
        await self._async_command(COMMAND_PLAY)

    @trace_call
    async def async_media_pause(self) -> None:
        await self._async_command(COMMAND_PAUSE)

    @trace_call
    async def async_media_stop(self) -> None:
        await self._async_command(COMMAND_STOP)

    @trace_call
    async def async_media_next_track(self) -> None:
        if not self._queue_supported:
            raise HomeAssistantError("BL-HAOS queue controls are unsupported by this bridge")
        await self._async_command(QUEUE_NEXT, queue_version=NATIVE_QUEUE_VERSION)

    @trace_call
    async def async_media_previous_track(self) -> None:
        if not self._queue_supported:
            raise HomeAssistantError("BL-HAOS queue controls are unsupported by this bridge")
        await self._async_command(QUEUE_PREVIOUS, queue_version=NATIVE_QUEUE_VERSION)

    @trace_call
    async def async_set_shuffle(self, shuffle: bool) -> None:
        if not self._queue_supported or not isinstance(shuffle, bool):
            raise HomeAssistantError("BL-HAOS queue shuffle is unavailable")
        await self._async_command(QUEUE_SET_SHUFFLE, queue_version=NATIVE_QUEUE_VERSION, shuffle=shuffle)

    @trace_call
    async def async_set_repeat(self, repeat: RepeatMode) -> None:
        if not self._queue_supported:
            raise HomeAssistantError("BL-HAOS queue repeat is unavailable")
        repeat_value = getattr(repeat, "value", None)
        if repeat_value not in {"off", "one", "all"}:
            raise HomeAssistantError("BL-HAOS queue repeat mode is invalid")
        await self._async_command(QUEUE_SET_REPEAT, queue_version=NATIVE_QUEUE_VERSION, repeat=repeat_value)

    @trace_call
    async def async_start_queue(self, record: dict) -> int:
        """Resolve a complete saved record before replacing the bridge queue."""
        if not self._queue_supported:
            raise HomeAssistantError("Selected BL-HAOS speaker does not support queue playback")
        if not self.entity_id or not self.available or not self._speaker.get(PAYLOAD_CONNECTED_KEY):
            raise HomeAssistantError("Selected BL-HAOS speaker is unavailable")

        if record.get("kind") == "custom":
            entries = record.get("entries")
        elif record.get("kind") == "provider":
            entries = [{
                "media_content_id": record.get("media_content_id"),
                "title": record.get("title"),
            }]
        else:
            entries = None
        if not isinstance(entries, list) or not 1 <= len(entries) <= MAX_QUEUE_ITEMS:
            raise HomeAssistantError("Playlist is empty or exceeds the supported item limit")

        playlist = _queue_display_value(record.get("name")) or "Saved playlist"
        resolved_items: list[dict[str, str]] = []
        payload_bytes = len(playlist.encode("utf-8"))
        for index, entry in enumerate(entries, start=1):
            reference = entry.get("media_content_id") if isinstance(entry, dict) else None
            try:
                if not isinstance(reference, str) or not is_media_source_id(reference):
                    raise ValueError("Invalid media reference")
                resolved = await async_resolve_media(self.hass, reference, self.entity_id)
                media_id = getattr(resolved, "url", None)
                if not isinstance(media_id, str) or not media_id.strip():
                    raise ValueError("Empty media resolution")
                parsed = urlsplit(media_id)
                absolute = parsed.scheme in {"http", "https"} and parsed.hostname
                relative = not parsed.scheme and not parsed.netloc and media_id.startswith("/") and not media_id.startswith("//")
                if not absolute and not relative:
                    raise ValueError("Unsupported media resolution")
                url = async_process_play_media_url(self.hass, media_id)
                if url.startswith("/"):
                    base_url = get_url(self.hass, prefer_external_url=False, allow_cloud=False)
                    if not base_url:
                        raise ValueError("Home Assistant playback URL is unavailable")
                    url = f"{base_url}{url}"
                parsed_url = urlsplit(url)
                if (
                    len(url) > MAX_QUEUE_URL_LENGTH
                    or parsed_url.scheme not in {"http", "https"}
                    or not parsed_url.hostname
                ):
                    raise ValueError("Resolved media URL is invalid")
            except Exception:
                raise HomeAssistantError(f"Could not resolve playlist item {index}") from None

            item: dict[str, str] = {"url": url}
            title = _queue_display_value(entry.get("title") or getattr(resolved, "title", None))
            artist = _queue_display_value(getattr(resolved, "artist", None))
            if title is not None:
                item["title"] = title
            if artist is not None:
                item["artist"] = artist
            payload_bytes += sum(len(value.encode("utf-8")) for value in item.values())
            if payload_bytes > MAX_QUEUE_PAYLOAD_BYTES:
                raise HomeAssistantError("Resolved playlist exceeds the supported payload limit")
            resolved_items.append(item)

        if not self._queue_supported or not self.available or not self._speaker.get(PAYLOAD_CONNECTED_KEY):
            raise HomeAssistantError("Selected BL-HAOS speaker became unavailable")
        try:
            await self._client.async_command(
                self._address,
                QUEUE_START,
                queue_version=NATIVE_QUEUE_VERSION,
                playlist=playlist,
                items=resolved_items,
            )
        except Exception:
            raise HomeAssistantError("BL-HAOS could not start the saved playlist") from None
        return len(resolved_items)

    @trace_call
    async def async_set_volume_level(self, volume: float) -> None:
        await self._async_command(COMMAND_SET_VOLUME, volume=volume)

    @trace_call
    async def async_play_media(self, media_type: str, media_id: str, **kwargs) -> None:
        """Resolve Home Assistant sources to an add-on-reachable media URL."""
        if kwargs.get("enqueue"):
            raise HomeAssistantError("BL-HAOS does not support queued playback")
        if not self.entity_id or not self.available or not self._speaker.get(PAYLOAD_CONNECTED_KEY):
            raise HomeAssistantError("Selected BL-HAOS speaker is unavailable")
        try:
            source_reference = is_media_source_id(media_id)
            if source_reference:
                media = await async_resolve_media(self.hass, media_id, self.entity_id)
                media_id = media.url
                media_type = media.mime_type or media_type
            if not isinstance(media_id, str) or not media_id.strip():
                raise ValueError("Empty media resolution")
            if source_reference:
                parsed = urlsplit(media_id)
                absolute = parsed.scheme in {"http", "https"} and parsed.hostname
                relative = not parsed.scheme and not parsed.netloc and media_id.startswith("/") and not media_id.startswith("//")
                if not absolute and not relative:
                    raise ValueError("Unsupported media resolution")
            url = async_process_play_media_url(self.hass, media_id)
            if url.startswith("/"):
                base_url = get_url(self.hass, prefer_external_url=False, allow_cloud=False)
                if not base_url:
                    raise HomeAssistantError("Home Assistant has no configured playback URL")
                url = f"{base_url}{url}"
        except Exception:
            raise HomeAssistantError(
                "Home Assistant could not resolve this media item; check provider access and availability"
            ) from None
        if not self.available or not self._speaker.get(PAYLOAD_CONNECTED_KEY):
            raise HomeAssistantError("Selected BL-HAOS speaker is unavailable")
        media_type = _normalize_media_type(media_type)
        _LOGGER.debug(
            "Entity %s resolving play_media: media_type=%s",
            self.entity_id,
            {"music": "audio", "audio/mpeg": "audio", "audio/flac": "audio", "audio/wav": "audio", "audio/ogg": "audio", "audio/mp4": "audio", "playlist": "playlist"}.get(media_type, "other"),
        )
        try:
            await self._async_command(COMMAND_PLAY_MEDIA, url=url, media_type=media_type)
        except Exception:
            raise HomeAssistantError(
                "BL-HAOS could not submit this media item; check the speaker connection and provider access"
            ) from None

    @trace_call
    async def async_browse_media(
        self, media_content_type: str | None = None, media_content_id: str | None = None
    ) -> BrowseMedia:
        """Let the Home Assistant UI browse folders/media sources for this speaker."""
        _LOGGER.debug(
            "Entity %s browsing media: type=%s, id=%s",
            self.entity_id,
            media_content_type,
            media_content_id,
        )
        result = _filter_audio_browse(await async_browse_media(self.hass, media_content_id))
        if result is None:
            raise HomeAssistantError("This media item is not supported for audio playback")
        return result
