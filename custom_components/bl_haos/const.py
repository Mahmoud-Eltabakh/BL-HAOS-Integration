"""Constants for the BL-HAOS custom integration."""

import logging
from collections.abc import MutableMapping
from typing import Any

DOMAIN = "bl_haos"
CONF_ENDPOINT = "endpoint"
CONF_TOKEN = "token"
CONF_LOG_LEVEL = "log_level"
BRIDGE_UNIQUE_ID = "bl_haos_native_bridge"
BRIDGE_ID = "bl_haos_native_bridge"
NATIVE_API_PATH = "/api/native"
# Unauthenticated identification endpoint. The integration checks this *before* it
# presents the native token, so a hostile or mistyped endpoint never receives the
# credential (see THREAT-MODEL.md, T4).
HEALTH_API_PATH = "/api/health"
BRIDGE_SERVICE_NAME = "BL-HAOS"
PLATFORMS = ("media_player",)
# The Home Assistant domain this integration registers entities in, used for
# entity-registry lookups (the platform name, not the integration's DOMAIN).
MEDIA_PLAYER_DOMAIN = "media_player"
INTEGRATION_LOGGER = "custom_components.bl_haos"
LOG_LEVEL_MAP = {"trace": "debug", "notice": "info", "fatal": "critical"}

# ---------------------------------------------------------------------------
# Native bridge transport contract
# ---------------------------------------------------------------------------
DEFAULT_PORT = 8099
HTTP_SCHEME_PREFIX = "http://"
HTTPS_SCHEME_PREFIX = "https://"
ENDPOINT_SCHEMES = (HTTP_SCHEME_PREFIX, HTTPS_SCHEME_PREFIX)
ENDPOINT_SCHEME_NAMES = frozenset({"http", "https"})
BEARER_PREFIX = "Bearer "
CONFIG_ENTRY_VERSION = 1
COMMAND_VERSION = 1
ENTRY_TITLE = "BL-HAOS Bluetooth Audio"
WEBSOCKET_NATIVE_PATH = "/ws/native"
COMMAND_TIMEOUT_SECONDS = 60
# A pooled keep-alive socket can be closed by the add-on between commands (its
# own keep-alive timeout, a restart, or an update). Every native command
# converges to a target state, so one retry is safe and turns a transient drop
# into a successful action.
COMMAND_ATTEMPTS = 2
COMMAND_RETRY_DELAY_SECONDS = 0.5
IDENTITY_TIMEOUT_SECONDS = 5
STREAM_RECONNECT_BASE_DELAY_SECONDS = 1
STREAM_RECONNECT_MAX_DELAY_SECONDS = 30
WEBSOCKET_HEARTBEAT_SECONDS = 30
MEDIA_TYPE_MAX_LENGTH = 128
ADDON_SLUG = "bl_haos"
ADDON_HOSTNAME_SLUG = "bl-haos"
MANUFACTURER = "BL-HAOS"
DEVICE_MODEL = "Bluetooth Speaker"
# Example Supervisor-private hostname shown as the manual-entry form default.
DEFAULT_ENDPOINT_EXAMPLE = f"{HTTP_SCHEME_PREFIX}c839f4a9-{ADDON_HOSTNAME_SLUG}:{DEFAULT_PORT}"

# ---------------------------------------------------------------------------
# Native payload vocabulary
# ---------------------------------------------------------------------------
EVENT_SPEAKER_UPDATED = "speaker_updated"
PAYLOAD_EVENT_KEY = "event"
PAYLOAD_DATA_KEY = "data"
PAYLOAD_SPEAKERS_KEY = "speakers"
PAYLOAD_ADDRESS_KEY = "address"
PAYLOAD_BRIDGE_ID_KEY = "bridge_id"
PAYLOAD_SERVICE_KEY = "service"
PAYLOAD_DETAIL_KEY = "detail"
PAYLOAD_ERROR_KEY = "error"
PAYLOAD_ERROR_CODE_KEY = "error_code"
PAYLOAD_VERSION_KEY = "version"
PAYLOAD_OPERATION_KEY = "operation"
PAYLOAD_PLAYBACK_KEY = "playback"
PAYLOAD_STATE_KEY = "state"
PAYLOAD_VOLUME_KEY = "volume"
PAYLOAD_NAME_KEY = "name"
PAYLOAD_ADAPTER_KEY = "adapter"
PAYLOAD_POSITION_KEY = "position"
PAYLOAD_POSITION_UPDATED_AT_KEY = "position_updated_at"
PAYLOAD_DURATION_KEY = "duration"
PAYLOAD_TITLE_KEY = "title"
PAYLOAD_ARTIST_KEY = "artist"
PAYLOAD_IS_AUDIO_SINK_KEY = "is_audio_sink"
PAYLOAD_TRUSTED_KEY = "trusted"
PAYLOAD_PAIRED_KEY = "paired"
# True when BlueZ withdrew the device object: a device BlueZ treats as temporary
# is one that is not paired, so the bridge keeps its record but flags it.
PAYLOAD_DETACHED_KEY = "detached"
PAYLOAD_CONNECTED_KEY = "connected"
PAYLOAD_AVAILABLE_KEY = "available"
ERROR_CODE_INVALID_TOKEN = "invalid_token"

# Command verbs and the bridge-side error markers the entity maps to messages.
COMMAND_PLAY = "play"
COMMAND_PAUSE = "pause"
COMMAND_STOP = "stop"
COMMAND_SET_VOLUME = "set_volume"
COMMAND_PLAY_MEDIA = "play_media"
AUTH_FAILURE_MARKER = "authentication failed"
UNTRUSTED_SINK_MARKER = "no longer a trusted audio sink"
NO_ACTIVE_PLAYBACK_MARKER = "No active playback to resume"
CONNECTION_DROPPED_MARKER = "BL-HAOS closed the connection before answering"

# ---------------------------------------------------------------------------
# Diagnostics projection
# ---------------------------------------------------------------------------
DIAGNOSTICS_CONTRACT_VERSION = 1
DIAGNOSTICS_EVENTS_VERSION = 1
DIAGNOSTICS_HEALTH_VERSION = 1
SUPPORT_BUNDLE_SCHEMA = "bl-haos.support-bundle"
HEALTH_STATUS_HEALTHY = "healthy"
HEALTH_STATUS_UNAVAILABLE = "unavailable"
DIAGNOSTICS_REDACT_KEYS = {
    "authorization",
    "credential",
    "endpoint",
    "media_id",
    "url",
    "token",
    "password",
}


class BLHAOSLoggerAdapter(logging.LoggerAdapter[logging.Logger]):
	"""Prefix integration messages so they are distinct in Home Assistant logs."""

	def process(
		self, msg: Any, kwargs: MutableMapping[str, Any]
	) -> tuple[Any, MutableMapping[str, Any]]:
		return f"[BL-HAOS] {msg}", kwargs


def get_logger(name: str) -> BLHAOSLoggerAdapter:
	"""Create a consistently labelled BL-HAOS integration logger."""
	return BLHAOSLoggerAdapter(logging.getLogger(name), {})


def normalize_log_level(value: str | None) -> str:
	"""Map the add-on log-level vocabulary to Python logging levels."""
	normalized = str(value or "info").strip().lower()
	normalized = LOG_LEVEL_MAP.get(normalized, normalized)
	return normalized if normalized in {"debug", "info", "warning", "error", "critical"} else "info"