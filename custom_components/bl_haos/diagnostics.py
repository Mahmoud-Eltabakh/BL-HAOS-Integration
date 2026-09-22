"""Diagnostics support for the BL-HAOS native integration."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.redact import async_redact_data

from .const import CONF_BRIDGE_TOKEN, CONF_ENDPOINT


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return config-entry state without token, endpoint, or media-bearing data."""
    client = entry.runtime_data.client
    speakers = list(client.speakers.values())
    payload = {
        "entry": {
            "entry_id": entry.entry_id,
            "endpoint_configured": bool(entry.data.get(CONF_ENDPOINT)),
            "bridge_token_configured": bool(entry.data.get(CONF_BRIDGE_TOKEN)),
        },
        "transport": {
            "available": client.transport_available,
            "speaker_count": len(speakers),
            "connected_speaker_count": sum(bool(speaker.get("connected")) for speaker in speakers),
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