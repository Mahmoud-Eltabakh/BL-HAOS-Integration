"""BL-HAOS integration setup."""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers import entity_registry as er
import logging

from .client import BLHAOSClient
from .const import CONF_ENDPOINT, CONF_LOG_LEVEL, CONF_TOKEN, DOMAIN, INTEGRATION_LOGGER, PLATFORMS, get_logger, normalize_log_level

_LOGGER = get_logger(__name__)


@dataclass
class BLHAOSRuntime:
    """Objects owned by one BL-HAOS config entry."""

    client: BLHAOSClient


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up BL-HAOS from a config entry."""
    effective_log_level = normalize_log_level(entry.data.get(CONF_LOG_LEVEL))
    logging.getLogger(INTEGRATION_LOGGER).setLevel(effective_log_level.upper())
    _LOGGER.debug(
        "Setting up BL-HAOS config entry %s (endpoint: %s, log_level: %s)",
        entry.entry_id,
        entry.data.get(CONF_ENDPOINT),
        effective_log_level,
    )
    client = BLHAOSClient(hass, entry.data[CONF_ENDPOINT], entry.data[CONF_TOKEN])
    try:
        await client.async_initialize()
        _LOGGER.debug(
            "BL-HAOS client initialized successfully for entry %s (transport_available=%s)",
            entry.entry_id,
            client.transport_available,
        )
    except Exception as error:
        _LOGGER.debug("Failed to initialize BL-HAOS client for entry %s: %s", entry.entry_id, error)
        await client.async_close()
        raise ConfigEntryNotReady("BL-HAOS add-on is unavailable") from error
    entry.runtime_data = BLHAOSRuntime(client)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    _LOGGER.debug(
        "BL-HAOS config entry %s setup completed with platforms: %s",
        entry.entry_id,
        PLATFORMS,
    )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a BL-HAOS config entry."""
    _LOGGER.debug("Unloading BL-HAOS config entry %s", entry.entry_id)
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        await entry.runtime_data.client.async_close()
        # Platform unload detaches entities but leaves their last state behind
        # as a restored/unavailable placeholder; remove the states so a reload
        # does not briefly show stale unavailable players.
        registry = er.async_get(hass)
        for entity in er.async_entries_for_config_entry(registry, entry.entry_id):
            hass.states.async_remove(entity.entity_id)
        _LOGGER.debug("BL-HAOS config entry %s unloaded successfully", entry.entry_id)
    else:
        _LOGGER.debug("BL-HAOS config entry %s unload returned False", entry.entry_id)
    return unloaded