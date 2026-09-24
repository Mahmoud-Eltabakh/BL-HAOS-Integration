"""Minimal homeassistant.exceptions stand-in."""


class HomeAssistantError(Exception):
    """Base Home Assistant error."""


class ConfigEntryNotReady(HomeAssistantError):
    """Raised when a config entry cannot finish setup yet."""
