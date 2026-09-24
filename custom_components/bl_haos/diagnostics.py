"""Diagnostics support for the BL-HAOS native integration."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.redact import async_redact_data

from .const import CONF_ENDPOINT, get_logger

_LOGGER = get_logger(__name__)


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return config-entry state without token, endpoint, or media-bearing data."""
    client = entry.runtime_data.client
    speakers = list(client.speakers.values())
    _LOGGER.debug(
        "Generating diagnostics for config entry %s (transport_available=%s, speaker_count=%d)",
        entry.entry_id,
        client.transport_available,
        len(speakers),
    )
    payload = {
        "contract_version": 1,
        "health_status": "healthy" if client.transport_available else "unavailable",
        "auth_failed": client.auth_failed,
        "entry": {
            "entry_id": entry.entry_id,
            "endpoint_configured": bool(entry.data.get(CONF_ENDPOINT)),
        },
        "transport": {
            "available": client.transport_available,
            "speaker_count": len(speakers),
            "connected_speaker_count": sum(bool(speaker.get("connected")) for speaker in speakers),
        },
        "support_bundle": {
            "available": client.transport_available,
            "schema": "bl-haos.support-bundle",
            "versions": {"diagnostics": 1, "events": 1, "health": 1},
        },
        "speakers": [
            {
                "available": bool(speaker.get("available")),
                "connected": bool(speaker.get("connected")),
                "playback_state": speaker.get("playback", {}).get("state"),
            }
            for speaker in speakers
        ],
    }
    return async_redact_data(
        payload,
        {"authorization", "credential", "endpoint", "media_id", "url", "token", "password"},
    )