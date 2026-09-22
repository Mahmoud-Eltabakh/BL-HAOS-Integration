"""Static package checks that do not require a Home Assistant runtime."""

import json
from pathlib import Path


ROOT = Path(__file__).parents[1]
COMPONENT = ROOT / "custom_components" / "bl_haos"


def test_hacs_component_layout_and_manifest():
    required = {"__init__.py", "client.py", "config_flow.py", "const.py", "manifest.json", "media_player.py"}
    assert required <= {path.name for path in COMPONENT.iterdir()}
    manifest = json.loads((COMPONENT / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["domain"] == "bl_haos"
    assert manifest["config_flow"] is True


def test_native_transport_is_token_authenticated_and_mqtt_free():
    source = "\n".join(path.read_text(encoding="utf-8") for path in COMPONENT.glob("*.py"))
    assert "CONF_BRIDGE_TOKEN" in source
    assert "/identity" in source
    assert "ws_connect" in source
    assert "mqtt" not in source.lower()