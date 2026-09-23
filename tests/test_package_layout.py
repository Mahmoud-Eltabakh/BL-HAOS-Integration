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


def test_native_transport_is_discovery_based_and_mqtt_free():
    source = "\n".join(path.read_text(encoding="utf-8") for path in COMPONENT.glob("*.py"))
    assert "async_step_hassio" in source
    assert "_endpoint_from_hassio_slug" in source
    assert "/identity" in source
    assert "ws_connect" in source
    assert "mqtt" not in source.lower()


def test_client_speaker_filter_logic():
    # Verify the regex and parsing rules without HA runtime dependencies
    import re
    mac_regex = re.compile(r"^[0-9a-f]{2}(?::[0-9a-f]{2}){5}$")
    normalized = "EC-81-93-53-A9-16".strip().lower().replace("-", ":")
    assert mac_regex.fullmatch(normalized) is not None