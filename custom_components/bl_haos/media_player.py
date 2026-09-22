"""Native Home Assistant media players backed by the BL-HAOS bridge."""

from __future__ import annotations

from homeassistant.components.media_player import (
    MediaPlayerDeviceClass,
    MediaPlayerEntity,
    MediaPlayerEntityFeature,
)
from homeassistant.components.media_source import async_resolve_media, is_media_source_id
from homeassistant.components.media_player import async_process_play_media_url
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .client import BLHAOSClient, normalize_address
from .const import DOMAIN


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up cached BL-HAOS speakers and subscribe for native updates."""
    client: BLHAOSClient = entry.runtime_data.client
    speakers: dict[str, BLHAOSMediaPlayer] = {}

    def _add_speaker(address: str) -> None:
        if address in speakers:
            speakers[address].async_write_ha_state()
            return
        entity = BLHAOSMediaPlayer(client, address)
        speakers[address] = entity
        async_add_entities([entity])

    @callback
    def async_discover_speaker(address: str) -> None:
        _add_speaker(address)

    for address in client.speakers:
        _add_speaker(address)
    entry.async_on_unload(client.async_add_listener(async_discover_speaker))


class BLHAOSMediaPlayer(MediaPlayerEntity):
    """A cached Bluetooth speaker exposed through the native bridge."""

    _attr_has_entity_name = True
    _attr_device_class = MediaPlayerDeviceClass.SPEAKER
    _attr_should_poll = False
    _attr_supported_features = (
        MediaPlayerEntityFeature.PLAY
        | MediaPlayerEntityFeature.PAUSE
        | MediaPlayerEntityFeature.STOP
        | MediaPlayerEntityFeature.VOLUME_SET
        | MediaPlayerEntityFeature.PLAY_MEDIA
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
        return self._client.transport_available and bool(self._speaker.get("available"))

    @property
    def state(self):
        return self._speaker.get("playback", {}).get("state", "idle")

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
            via_device=(DOMAIN, self._speaker.get("adapter", "adapter")),
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
            self.async_write_ha_state()

    async def async_media_play(self) -> None:
        await self._client.async_command(self._address, "play")

    async def async_media_pause(self) -> None:
        await self._client.async_command(self._address, "pause")

    async def async_media_stop(self) -> None:
        await self._client.async_command(self._address, "stop")

    async def async_set_volume_level(self, volume: float) -> None:
        await self._client.async_command(self._address, "set_volume", volume=volume)

    async def async_play_media(self, media_type: str, media_id: str, **kwargs) -> None:
        """Resolve Home Assistant sources to an add-on-reachable media URL."""
        if kwargs.get("enqueue"):
            raise ValueError("BL-HAOS does not support queued playback")
        if is_media_source_id(media_id):
            media = await async_resolve_media(self.hass, media_id, self.entity_id)
            media_id = media.url
            media_type = media.mime_type or media_type
        url = async_process_play_media_url(self.hass, media_id)
        await self._client.async_command(self._address, "play_media", url=url, media_type=media_type)