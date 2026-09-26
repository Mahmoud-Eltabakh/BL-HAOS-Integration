"""Native Home Assistant media players backed by the BL-HAOS bridge."""

from __future__ import annotations

import re
from collections.abc import Callable
from datetime import datetime, timezone

import aiohttp
from homeassistant.components.media_player import (
    BrowseMedia,
    MediaPlayerDeviceClass,
    MediaPlayerEntity,
    MediaPlayerEntityFeature,
    MediaPlayerState,
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
    PAYLOAD_STATE_KEY,
    PAYLOAD_TITLE_KEY,
    PAYLOAD_VOLUME_KEY,
    UNTRUSTED_SINK_MARKER,
    get_logger,
)
from .speaker_policy import ENTITY_DISABLED, ENTITY_REMOVED, desired_entity_state

_LOGGER = get_logger(__name__)

# Home Assistant content types ("music", "video", "audio/mpeg", "channel") and
# MIME types both fit this bounded, structurally safe token shape. The value is
# only informational for the bridge — ffmpeg sniffs the real stream — so pass it
# through and drop anything that does not fit instead of failing playback.
_MEDIA_TYPE_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9!#$&^_.+-]*(?:/[A-Za-z0-9!#$&^_.+-]+)?$")


def _normalize_media_type(media_type: str | None) -> str | None:
    """Return a safe media-type token for the bridge, or None when unusable."""
    if not media_type or not isinstance(media_type, str):
        return None
    candidate = media_type.strip()
    if not candidate or len(candidate) > MEDIA_TYPE_MAX_LENGTH or not _MEDIA_TYPE_PATTERN.fullmatch(candidate):
        return None
    return candidate.lower()


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: Callable,
) -> None:
    """Set up cached BL-HAOS speakers and subscribe for native updates."""
    client: BLHAOSClient = entry.runtime_data.client
    speakers: dict[str, BLHAOSMediaPlayer] = {}
    _LOGGER.debug(
        "Setting up BL-HAOS media player platform for entry %s (%d initial speakers: %s)",
        entry.entry_id,
        len(client.speakers),
        list(client.speakers.keys()),
    )

    def _add_speaker(address: str, *, disabled: bool = False) -> None:
        existing = speakers.get(address)
        if existing is not None:
            if not disabled:
                _LOGGER.debug("Updating existing media player entity for speaker %s", address)
                existing.async_write_ha_state()
            return
        entity = BLHAOSMediaPlayer(client, address)
        speakers[address] = entity
        _LOGGER.debug("Adding new media player entity for speaker %s (%s)", address, entity.name)
        async_add_entities([entity])

    def _remove_speaker(address: str) -> None:
        entity = speakers.pop(address, None)
        if entity is None:
            return
        _LOGGER.debug("Removing the media player entity of speaker %s", address)
        hass.async_create_task(entity.async_remove(force_remove=True))

    def _sync_disabled_state(entity: BLHAOSMediaPlayer, *, disabled: bool) -> None:
        """Keep the entity's registry state in step with the speaker's link.

        A speaker that is paired but switched off is disabled rather than
        removed: it leaves the state machine without losing its identity, and it
        is enabled again the moment the speaker connects. Only a disable this
        integration applied is cleared - an entity the operator disabled by hand
        stays disabled.
        """
        registry = er.async_get(hass)
        entity_id = registry.async_get_entity_id(MEDIA_PLAYER_DOMAIN, DOMAIN, entity.unique_id)
        if entity_id is None:
            return
        entry = registry.async_get(entity_id)
        if entry is None:
            return
        if disabled:
            if entry.disabled_by is None:
                _LOGGER.debug("Disabling media player entity %s (speaker is paired but not connected)", entity_id)
                registry.async_update_entity(entity_id, disabled_by=er.RegistryEntryDisabler.INTEGRATION)
            # A disabled entity must not leave a state behind, or dashboards keep
            # showing a dead card for a speaker that is not connected.
            hass.states.async_remove(entity_id)
            return
        if entry.disabled_by == er.RegistryEntryDisabler.INTEGRATION:
            _LOGGER.debug("Enabling media player entity %s (speaker is connected)", entity_id)
            registry.async_update_entity(entity_id, disabled_by=None)

    @callback
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
        if desired == ENTITY_DISABLED and address not in speakers:
            # Nothing to disable: a speaker that has not connected since this
            # entry was set up has no entity yet. It gets one when it connects.
            _LOGGER.debug("Speaker %s is paired but not connected; no entity exists yet", address)
            return
        _LOGGER.debug("Discovered / refreshed speaker %s", address)
        _add_speaker(address, disabled=desired == ENTITY_DISABLED)
        _sync_disabled_state(speakers[address], disabled=desired == ENTITY_DISABLED)

    # Seed the platform through the same policy the listener uses, so a speaker
    # that is paired but offline is disabled (not created, if it has no entity
    # yet) exactly as it would be on the next update.
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

    def __init__(self, client: BLHAOSClient, address: str) -> None:
        """Initialize a native media player for one Bluetooth speaker."""
        self._client = client
        self._address = normalize_address(address)
        self._attr_unique_id = f"{DOMAIN}_{self._address.replace(':', '')}"

    @property
    def _speaker(self) -> dict:
        return self._client.get_speaker(self._address) or {}

    @property
    def _playback(self) -> dict:
        playback = self._speaker.get(PAYLOAD_PLAYBACK_KEY)
        return playback if isinstance(playback, dict) else {}

    @property
    def name(self) -> str:
        return self._speaker.get(PAYLOAD_NAME_KEY, self._address)

    @property
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
    def state(self):
        """Return the state of the device."""
        if not self._speaker.get(PAYLOAD_CONNECTED_KEY):
            return MediaPlayerState.OFF
        bridge_state = self._playback.get(PAYLOAD_STATE_KEY, MediaPlayerState.IDLE)
        valid_states = {MediaPlayerState.IDLE, MediaPlayerState.PLAYING, MediaPlayerState.PAUSED}
        return bridge_state if bridge_state in valid_states else MediaPlayerState.IDLE

    @property
    def volume_level(self) -> float | None:
        return self._playback.get(PAYLOAD_VOLUME_KEY)

    @property
    def media_position(self) -> int | None:
        """Elapsed playback time so Home Assistant can draw a progress bar."""
        position = self._playback.get(PAYLOAD_POSITION_KEY)
        return int(position) if isinstance(position, (int, float)) else None

    @property
    def media_position_updated_at(self) -> datetime | None:
        """Timestamp the reported position belongs to; HA extrapolates from here."""
        updated = self._playback.get(PAYLOAD_POSITION_UPDATED_AT_KEY)
        if not isinstance(updated, (int, float)):
            return None
        return datetime.fromtimestamp(updated, tz=timezone.utc)

    @property
    def media_duration(self) -> int | None:
        """Total media length in seconds, once the bridge has probed it."""
        duration = self._playback.get(PAYLOAD_DURATION_KEY)
        return int(duration) if isinstance(duration, (int, float)) and duration > 0 else None

    @property
    def media_title(self) -> str | None:
        """Name of the stream being played, so Home Assistant can label it."""
        title = self._playback.get(PAYLOAD_TITLE_KEY)
        return title if isinstance(title, str) and title.strip() else None

    @property
    def media_artist(self) -> str | None:
        """Embedded artist tag when the media carries one."""
        artist = self._playback.get(PAYLOAD_ARTIST_KEY)
        return artist if isinstance(artist, str) and artist.strip() else None

    @property
    def device_info(self) -> DeviceInfo:
        return DeviceInfo(
            identifiers={(DOMAIN, self._address)},
            name=self.name,
            manufacturer=MANUFACTURER,
            model=DEVICE_MODEL,
        )

    @property
    def extra_state_attributes(self) -> dict[str, str]:
        """Expose the physical Bluetooth address for diagnostics."""
        return {"bluetooth_address": self._address, PAYLOAD_ADAPTER_KEY: self._speaker.get(PAYLOAD_ADAPTER_KEY, "")}

    async def async_added_to_hass(self) -> None:
        """Push cached state changes without entity network I/O."""
        await super().async_added_to_hass()
        self.async_on_remove(self._client.async_add_listener(self._async_speaker_updated))

    @callback
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

    async def _async_command(self, operation: str, **kwargs) -> None:
        _LOGGER.debug("Entity %s executing command: %s (kwargs: %s)", self.entity_id, operation, kwargs)
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
            _LOGGER.debug("Entity %s command %s failed: %s", self.entity_id, operation, error)
            raise HomeAssistantError(f"Failed to {operation}: {error}") from error
        except TimeoutError as error:
            _LOGGER.debug("Entity %s command %s timed out", self.entity_id, operation)
            raise HomeAssistantError(f"Timeout communicating with speaker during {operation}") from error

    async def async_media_play(self) -> None:
        await self._async_command(COMMAND_PLAY)

    async def async_media_pause(self) -> None:
        await self._async_command(COMMAND_PAUSE)

    async def async_media_stop(self) -> None:
        await self._async_command(COMMAND_STOP)

    async def async_set_volume_level(self, volume: float) -> None:
        await self._async_command(COMMAND_SET_VOLUME, volume=volume)

    async def async_play_media(self, media_type: str, media_id: str, **kwargs) -> None:
        """Resolve Home Assistant sources to an add-on-reachable media URL."""
        if kwargs.get("enqueue"):
            raise HomeAssistantError("BL-HAOS does not support queued playback")
        if is_media_source_id(media_id):
            media = await async_resolve_media(self.hass, media_id, self.entity_id)
            media_id = media.url
            media_type = media.mime_type or media_type
        url = async_process_play_media_url(self.hass, media_id)
        if url.startswith("/"):
            base_url = get_url(self.hass, prefer_external_url=False, allow_cloud=False)
            if not base_url:
                raise HomeAssistantError(
                    "Home Assistant has no configured internal or external URL;"
                    " set one under Settings > System > Network so local media"
                    " can be resolved for the BL-HAOS add-on"
                )
            url = f"{base_url}{url}"
        media_type = _normalize_media_type(media_type)
        _LOGGER.debug(
            "Entity %s resolving play_media: original_type=%s -> final_type=%s, url=%s",
            self.entity_id,
            kwargs.get("media_type"),
            media_type,
            url,
        )
        await self._async_command(COMMAND_PLAY_MEDIA, url=url, media_type=media_type)

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
        return await async_browse_media(self.hass, media_content_id)