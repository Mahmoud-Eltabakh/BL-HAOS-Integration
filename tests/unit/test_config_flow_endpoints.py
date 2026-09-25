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
