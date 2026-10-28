"""Authenticated bridge/integration product compatibility policy."""

from __future__ import annotations

import re
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Literal

from .const import DOMAIN
from .call_trace import trace_call

CompatibilityStatus = Literal["compatible", "incompatible", "unknown_legacy"]
MINIMUM_ADDON_VERSION = "0.2.70"
NATIVE_PROTOCOL_VERSION = 1
ISSUE_ID_PREFIX = "compatibility_"
_STABLE_VERSION = re.compile(r"^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$")


@dataclass(frozen=True)
class CompatibilityResult:
    """Bounded, safe-to-cache result; never retains the raw identity response."""

    status: CompatibilityStatus
    reason: str
    addon_version: str | None
    integration_version: str | None
    min_integration_version: str | None
    min_addon_version: str
    protocol_version: int | None

    @trace_call
    def as_dict(self) -> dict[str, Any]:
        return asdict(self)


@trace_call
def _stable_parts(value: Any) -> tuple[int, int, int] | None:
    if not isinstance(value, str) or not _STABLE_VERSION.fullmatch(value):
        return None
    return tuple(int(part) for part in value.split("."))  # type: ignore[return-value]


@trace_call
def _version_at_least(observed: str, required: str) -> bool:
    """Compare stable numeric versions semantically, never lexically."""
    left = _stable_parts(observed)
    right = _stable_parts(required)
    if left is None or right is None:
        return False
    try:
        # Home Assistant includes AwesomeVersion. Keep the numeric fallback for
        # the project's Windows unit-test harness, which intentionally has no HA.
        from awesomeversion import AwesomeVersion
    except ImportError:
        return left >= right
    return AwesomeVersion(observed) >= AwesomeVersion(required)


@trace_call
def evaluate_identity(identity: Any, integration_version: str) -> CompatibilityResult:
    """Apply the one compatibility matrix to an authenticated identity payload."""
    protocol = identity.get("version") if isinstance(identity, dict) else None
    protocol_value = protocol if type(protocol) is int else None
    addon = identity.get("addon_version") if isinstance(identity, dict) else None
    minimum_integration = identity.get("min_integration_version") if isinstance(identity, dict) else None
    integration_parts = _stable_parts(integration_version)
    addon_parts = _stable_parts(addon)
    minimum_parts = _stable_parts(minimum_integration)

    @trace_call
    def result(status: CompatibilityStatus, reason: str) -> CompatibilityResult:
        return CompatibilityResult(
            status=status,
            reason=reason,
            addon_version=addon if isinstance(addon, str) else None,
            integration_version=integration_version if isinstance(integration_version, str) else None,
            min_integration_version=minimum_integration if isinstance(minimum_integration, str) else None,
            min_addon_version=MINIMUM_ADDON_VERSION,
            protocol_version=protocol_value,
        )

    if protocol_value != NATIVE_PROTOCOL_VERSION:
        return result("incompatible", "unsupported_protocol")
    if not isinstance(identity, dict):
        return result("incompatible", "invalid_identity")
    if "addon_version" not in identity and "min_integration_version" not in identity:
        return result("unknown_legacy", "legacy_metadata_missing")
    if addon_parts is None or minimum_parts is None or integration_parts is None:
        return result("incompatible", "invalid_version_metadata")
    if not _version_at_least(integration_version, minimum_integration):
        return result("incompatible", "integration_too_old")
    if not _version_at_least(addon, MINIMUM_ADDON_VERSION):
        return result("incompatible", "addon_too_old")
    return result("compatible", "supported")


@trace_call
async def get_installed_integration_version(hass: Any) -> str:
    """Read this integration's loaded manifest version through HA metadata."""
    try:
        from homeassistant.loader import async_get_integration

        integration = async_get_integration(hass, DOMAIN)
        if hasattr(integration, "__await__"):
            integration = await integration
        version = getattr(integration, "version", None)
        if isinstance(version, str):
            return version
    except (ImportError, AttributeError, RuntimeError):
        # The Windows unit harness intentionally runs without Home Assistant.
        pass
    manifest = Path(__file__).with_name("manifest.json")
    import json

    payload = json.loads(manifest.read_text(encoding="utf-8"))
    version = payload.get("version")
    return version if isinstance(version, str) else ""


@trace_call
async def evaluate_bridge_identity(hass: Any, identity: Any) -> CompatibilityResult:
    version = await get_installed_integration_version(hass)
    return evaluate_identity(identity, version)


@trace_call
def issue_id(entry_id: str) -> str:
    return f"{ISSUE_ID_PREFIX}{entry_id}"


@trace_call
async def async_update_compatibility_issue(hass: Any, entry_id: str, result: CompatibilityResult) -> None:
    """Create/update the stable per-entry repair, or clear it after recovery."""
    from homeassistant.helpers import issue_registry as ir

    identifier = issue_id(entry_id)
    if result.status == "compatible":
        ir.async_delete_issue(hass, DOMAIN, identifier)
        return
    warning = result.status == "unknown_legacy"
    placeholders = {
        "observed_addon_version": result.addon_version or "unknown",
        "required_addon_version": result.min_addon_version,
        "observed_integration_version": result.integration_version or "unknown",
        "required_integration_version": result.min_integration_version or "unknown",
        "reason": result.reason,
    }
    ir.async_create_issue(
        hass,
        DOMAIN,
        identifier,
        is_fixable=False,
        severity=ir.IssueSeverity.WARNING if warning else ir.IssueSeverity.ERROR,
        translation_key="bridge_legacy" if warning else "bridge_incompatible",
        translation_placeholders=placeholders,
        is_persistent=True,
    )
