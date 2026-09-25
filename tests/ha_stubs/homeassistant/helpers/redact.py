"""Minimal homeassistant.helpers.redact stand-in.

Mirrors the contract diagnostics.py relies on: return a copy of the payload with
any key in ``keys`` replaced by HA's redaction marker, recursing through nested
dicts and lists.
"""

from __future__ import annotations

from typing import Any

REDACTED = "**REDACTED**"


def _redact(value: Any, keys: set[str]) -> Any:
    if isinstance(value, dict):
        return {key: (REDACTED if key in keys else _redact(item, keys)) for key, item in value.items()}
    if isinstance(value, list):
        return [_redact(item, keys) for item in value]
    return value


def async_redact_data(data: dict[str, Any], keys: set[str]) -> dict[str, Any]:
    return _redact(data, set(keys))
