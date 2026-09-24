"""Native Home Assistant media players backed by the BL-HAOS bridge."""

from __future__ import annotations

from collections.abc import Callable

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
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.network import get_url

from .client import BLHAOSClient, normalize_address
from .const import DOMAIN, get_logger

_LOGGER = get_logger(__name__)


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

    def _add_speaker(address: str) -> None:
        if address in speakers:
            _LOGGER.debug("Updating existing media player entity for speaker %s", address)
            speakers[address].async_write_ha_state()
            return
        entity = BLHAOSMediaPlayer(client, address)
        speakers[address] = entity
        _LOGGER.debug("Adding new media player entity for speaker %s (%s)", address, entity.name)
        async_add_entities([entity])

    @callback
    def async_discover_speaker(address: str) -> None:
        if address not in client.speakers:
            _LOGGER.debug("Removing speaker entity for evicted address %s", address)
            entity = speakers.pop(address, None)
            if entity is not None:
                hass.async_create_task(entity.async_remove(force_remove=True))
            return
        _LOGGER.debug("Discovered / refreshed speaker %s", address)
        _add_speaker(address)

    for address in client.speakers:
        _add_speaker(address)
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
    def name(self) -> str:
        return self._speaker.get("name", self._address)

    @property
    def available(self) -> bool:
        """Entity is available as long as the native bridge transport is alive."""
        return self._client.transport_available

    @property
    def state(self):
        """Return the state of the device."""
        if not self._speaker.get("connected"):
            return MediaPlayerState.OFF
        bridge_state = self._speaker.get("playback", {}).get("state", MediaPlayerState.IDLE)
        valid_states = {MediaPlayerState.IDLE, MediaPlayerState.PLAYING, MediaPlayerState.PAUSED}
        return bridge_state if bridge_state in valid_states else MediaPlayerState.IDLE

    @property
    def volume_level(self) -> float | None:
        return self._speaker.get("playback", {}).get("volume")

    @property
    def device_info(self) -> DeviceInfo:
        return DeviceInfo(
            identifiers={(DOMAIN, self._address)},
            name=self.name,
            manufacturer="BL-HAOS",
            model="Bluetooth Speaker",
        )

    @property
    def extra_state_attributes(self) -> dict[str, str]:
        """Expose the physical Bluetooth address for diagnostics."""
        return {"bluetooth_address": self._address, "adapter": self._speaker.get("adapter", "")}

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
            if operation == "play" and "No active playback to resume" in message:
                _LOGGER.debug("Entity %s ignore 'No active playback to resume'", self.entity_id)
                return
            if "authentication failed" in message.lower():
                raise HomeAssistantError(
                    "BL-HAOS rejected the configured token; reload the integration entry to retry"
                ) from error
            if "no longer a trusted audio sink" in message:
                raise HomeAssistantError(
                    "Speaker disconnected while the command was in flight"
                ) from error
            _LOGGER.debug("Entity %s command %s failed: %s", self.entity_id, operation, error)
            raise HomeAssistantError(f"Failed to {operation}: {error}") from error
        except TimeoutError as error:
            _LOGGER.debug("Entity %s command %s timed out", self.entity_id, operation)
            raise HomeAssistantError(f"Timeout communicating with speaker during {operation}") from error

    async def async_media_play(self) -> None:
        await self._async_command("play")

    async def async_media_pause(self) -> None:
        await self._async_command("pause")

    async def async_media_stop(self) -> None:
        await self._async_command("stop")

    async def async_set_volume_level(self, volume: float) -> None:
        await self._async_command("set_volume", volume=volume)

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
        if media_type and not media_type.startswith("audio/"):
            media_type = None
        _LOGGER.debug(
            "Entity %s resolving play_media: original_type=%s -> final_type=%s, url=%s",
            self.entity_id,
            kwargs.get("media_type"),
            media_type,
            url,
        )
        await self._async_command("play_media", url=url, media_type=media_type)

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