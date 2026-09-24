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
PLATFORMS = ("media_player",)
INTEGRATION_LOGGER = "custom_components.bl_haos"
LOG_LEVEL_MAP = {"trace": "debug", "notice": "info", "fatal": "critical"}


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