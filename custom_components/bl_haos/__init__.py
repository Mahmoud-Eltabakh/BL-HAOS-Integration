"""BL-HAOS integration setup."""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.config_entries import ConfigEntry
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.core import HomeAssistant

from .client import BLHAOSClient
from .const import CONF_ENDPOINT, DOMAIN, PLATFORMS


@dataclass
class BLHAOSRuntime:
    """Objects owned by one BL-HAOS config entry."""

    client: BLHAOSClient


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up BL-HAOS from a config entry."""
    client = BLHAOSClient(hass, entry.data[CONF_ENDPOINT])
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
    return unloaded