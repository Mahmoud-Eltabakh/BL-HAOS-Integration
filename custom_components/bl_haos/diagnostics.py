"""Diagnostics support for the BL-HAOS native integration."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.redact import async_redact_data

from .const import (
    CONF_ENDPOINT,
    DIAGNOSTICS_CONTRACT_VERSION,
    DIAGNOSTICS_EVENTS_VERSION,
    DIAGNOSTICS_HEALTH_VERSION,
    DIAGNOSTICS_REDACT_KEYS,
    HEALTH_STATUS_HEALTHY,
    HEALTH_STATUS_UNAVAILABLE,
    PAYLOAD_AVAILABLE_KEY,
    PAYLOAD_CONNECTED_KEY,
    PAYLOAD_PLAYBACK_KEY,
    PAYLOAD_STATE_KEY,
    SUPPORT_BUNDLE_SCHEMA,
    get_logger,
)

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
        "contract_version": DIAGNOSTICS_CONTRACT_VERSION,
        "health_status": HEALTH_STATUS_HEALTHY if client.transport_available else HEALTH_STATUS_UNAVAILABLE,
        "auth_failed": client.auth_failed,
        "entry": {
            "entry_id": entry.entry_id,
            "endpoint_configured": bool(entry.data.get(CONF_ENDPOINT)),
        },
        "transport": {
            "available": client.transport_available,
            "speaker_count": len(speakers),
            "connected_speaker_count": sum(bool(speaker.get(PAYLOAD_CONNECTED_KEY)) for speaker in speakers),
        },
        # Event-stream history: the add-on restarts on every update/config change,
        # so "why did the log show a disconnect" is answerable from here. An outage
        # is one loss of the stream; failed_attempts counts the retries inside it.
        # Reasons are categories, never raw connection errors (those embed the
        # endpoint).
        "stream": {
            "available": client.transport_available,
            "outages": client.stream_outages,
            "failed_attempts": client.stream_failed_attempts,
            "reconnects": client.stream_reconnects,
            "consecutive_failures": client.consecutive_failures,
            "last_reason": client.last_disconnect_reason,
            "last_disconnect_at": client.last_disconnect_at,
            "last_recovery_at": client.last_recovery_at,
            "last_outage_seconds": client.last_outage_seconds,
            "credential_rejected": client.auth_failed,
        },
        "support_bundle": {
            "available": client.transport_available,
            "schema": SUPPORT_BUNDLE_SCHEMA,
            "versions": {
                "diagnostics": DIAGNOSTICS_CONTRACT_VERSION,
                "events": DIAGNOSTICS_EVENTS_VERSION,
                "health": DIAGNOSTICS_HEALTH_VERSION,
            },
        },
        "speakers": [
            {
                "available": bool(speaker.get(PAYLOAD_AVAILABLE_KEY)),
                "connected": bool(speaker.get(PAYLOAD_CONNECTED_KEY)),
                "playback_state": speaker.get(PAYLOAD_PLAYBACK_KEY, {}).get(PAYLOAD_STATE_KEY),
            }
            for speaker in speakers
        ],
    }
    return async_redact_data(payload, DIAGNOSTICS_REDACT_KEYS)