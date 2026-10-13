"""Contract checks for the supported Home Assistant panel/static APIs."""

import os
import sys
from importlib.metadata import version
from pathlib import Path

import pytest

if sys.platform == "win32" and os.environ.get("BLHAOS_RUN_SIL") != "1":
    pytest.skip("Home Assistant SIL requires Linux or WSL2", allow_module_level=True)

from homeassistant.components import panel_custom
from homeassistant.components.http.const import DOMAIN as HTTP_DOMAIN
from homeassistant.components.http.server import StaticPathConfig
from homeassistant.setup import async_setup_component


TARGET_CORE_VERSION = "2026.9.4"
PANEL_URL = "/api/bl_haos/catalog/bl-haos-media-panel.js"


def test_sil_runtime_matches_target_core_release() -> None:
    assert version("homeassistant") == TARGET_CORE_VERSION


async def test_panel_custom_accepts_module_url(hass) -> None:
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path="bl-haos-media",
        webcomponent_name="bl-haos-media-panel",
        module_url=PANEL_URL,
        sidebar_title="BL-HAOS Media",
        sidebar_icon="mdi:play-box-multiple",
    )


async def test_http_accepts_integration_static_path(hass, tmp_path: Path) -> None:
    assert await async_setup_component(hass, HTTP_DOMAIN, {})
    bundle = tmp_path / "bl-haos-media-panel.js"
    bundle.write_text("customElements.define('bl-haos-media-panel', class {});", encoding="utf-8")
    static_path = StaticPathConfig(
        "/api/bl_haos/catalog",
        str(tmp_path),
        cache_headers=True,
    )

    await hass.http.async_register_static_paths([static_path])