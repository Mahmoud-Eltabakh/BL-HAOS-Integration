"""BL-HAOS integration setup."""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers import entity_registry as er

from .client import BLHAOSClient
from .const import CONF_ENDPOINT, CONF_TOKEN, DOMAIN, PLATFORMS


@dataclass
class BLHAOSRuntime:
    """Objects owned by one BL-HAOS config entry."""

    client: BLHAOSClient


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up BL-HAOS from a config entry."""
    client = BLHAOSClient(hass, entry.data[CONF_ENDPOINT], entry.data[CONF_TOKEN])
    try:
        await client.async_initialize()
    except Exception as error:
        await client.async_close()
        raise ConfigEntryNotReady("BL-HAOS add-on is unavailable") from error
    entry.runtime_data = BLHAOSRuntime(client)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a BL-HAOS config entry."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        await entry.runtime_data.client.async_close()
        registry = er.async_get(hass)
        for entity in er.async_entries_for_config_entry(registry, entry.entry_id):
            hass.states.async_remove(entity.entity_id)
    return unloaded