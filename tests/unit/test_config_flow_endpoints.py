"""Config-flow endpoint handling, checkable without the Home Assistant runtime.

``_validate_endpoint`` and ``_endpoint_from_hassio_slug`` decide which endpoint
the integration stores. Until now the only suite that executed them was the
Linux-only SIL job, so a defect here surfaced as a CI failure with no local
counterpart — exactly how an undefined constant once reached main.

Both helpers are pure, so this module imports the platform config flow with the
``ha_stubs`` stand-ins in place and drives them directly.
"""

from __future__ import annotations

import sys
from pathlib import Path

import pytest

_STUBS_DIR = Path(__file__).resolve().parents[1] / "ha_stubs"
if str(_STUBS_DIR) not in sys.path:
    sys.path.insert(0, str(_STUBS_DIR))

from custom_components.bl_haos.config_flow import BLHAOSConfigFlow  # noqa: E402
from custom_components.bl_haos.compatibility import CompatibilityResult  # noqa: E402
from unittest.mock import AsyncMock, Mock  # noqa: E402
from types import SimpleNamespace  # noqa: E402
from custom_components.bl_haos.const import (  # noqa: E402
    ADDON_SLUG,
    DEFAULT_PORT,
    HTTP_SCHEME_PREFIX,
)

HOSTNAME = "homeassistant.local"


@pytest.mark.parametrize(
    ("raw_endpoint", "expected"),
    (
        ("", None),
        ("   ", None),
        # A path, query, fragment, or credentials means "not a bridge endpoint".
        ("https://bad.example/path", None),
        ("localhost:8099/?token=x", None),
        ("localhost:8099/#frag", None),
        ("http://user:password@localhost:8099", None),
        ("ftp://localhost:8099", None),
        # A bare host gains the scheme and the default bridge port.
        (HOSTNAME, f"{HTTP_SCHEME_PREFIX}{HOSTNAME}:{DEFAULT_PORT}"),
        (f"{HOSTNAME}:{DEFAULT_PORT}", f"{HTTP_SCHEME_PREFIX}{HOSTNAME}:{DEFAULT_PORT}"),
        (f"{HTTP_SCHEME_PREFIX}{HOSTNAME}:{DEFAULT_PORT}/", f"{HTTP_SCHEME_PREFIX}{HOSTNAME}:{DEFAULT_PORT}"),
    ),
)
def test_validate_endpoint_normalizes_or_rejects(raw_endpoint, expected):
    assert BLHAOSConfigFlow._validate_endpoint(raw_endpoint) == expected


@pytest.mark.parametrize(
    ("slug", "expected"),
    (
        (f"c839f4a9_{ADDON_SLUG}", f"{HTTP_SCHEME_PREFIX}c839f4a9-{ADDON_SLUG.replace('_', '-')}:{DEFAULT_PORT}"),
        ("local_bl-haos", f"{HTTP_SCHEME_PREFIX}local-bl-haos:{DEFAULT_PORT}"),
        ("c839f4a9_some_other_addon", None),
        ("", None),
    ),
)
def test_endpoint_from_hassio_slug_only_matches_this_addon(slug, expected):
    assert BLHAOSConfigFlow._endpoint_from_hassio_slug(slug) == expected


async def test_manual_flow_surfaces_a_specific_incompatibility_error():
    flow = BLHAOSConfigFlow()
    flow.hass = SimpleNamespace()
    flow.async_set_unique_id = AsyncMock()
    flow._abort_if_unique_id_configured = Mock()
    flow.async_show_form = Mock(return_value={"type": "form"})
    flow._async_validate_connection = AsyncMock(return_value=CompatibilityResult(
        status="incompatible", reason="addon_too_old", addon_version="0.2.69",
        integration_version="0.2.22", min_integration_version="0.2.22",
        min_addon_version="0.2.70", protocol_version=1,
    ))

    result = await flow.async_step_user({"endpoint": HOSTNAME, "token": "secret"})

    assert result["type"] == "form"
    assert flow.async_show_form.call_args.kwargs["errors"]["base"] == "incompatible_version"
    flow.async_create_entry = Mock(side_effect=AssertionError("incompatible peers must not create entries"))


async def test_discovery_confirmation_aborts_on_known_incompatibility():
    flow = BLHAOSConfigFlow()
    flow._discovered_endpoint = f"{HTTP_SCHEME_PREFIX}bl-haos:{DEFAULT_PORT}"
    flow._discovered_log_level = "info"
    flow.async_abort = Mock(return_value={"type": "abort"})
    flow._async_validate_connection = AsyncMock(return_value=CompatibilityResult(
        status="incompatible", reason="integration_too_old", addon_version="0.2.71",
        integration_version="0.2.21", min_integration_version="0.2.22",
        min_addon_version="0.2.70", protocol_version=1,
    ))

    result = await flow.async_step_hassio_confirm({"token": "secret"})

    assert result == {"type": "abort"}
    flow.async_abort.assert_called_once_with(reason="incompatible_version")
