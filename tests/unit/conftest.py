"""Install ha_stubs only when the real Home Assistant helpers are unusable.

The real Home Assistant package may import successfully on this machine, but
its `async_get_clientsession` requires a fully-initialized hass object (event
loop, connector pool, resolver). Unit tests drive BLHAOSClient with a plain
fake hass, so the stub session provider is always required here and takes
precedence over the real helper. SIL tests (tests/test_ha_integration_sil.py)
do NOT import this conftest and use the real runtime with pytest mocks.
"""

from __future__ import annotations

import sys
from pathlib import Path
from types import ModuleType, SimpleNamespace
from unittest.mock import Mock

_STUBS_DIR = Path(__file__).resolve().parents[1] / "ha_stubs"
sys.path.insert(0, str(_STUBS_DIR))

if "homeassistant.components" not in sys.modules:
	components = ModuleType("homeassistant.components")
	components.frontend = SimpleNamespace(
		DATA_PANELS="frontend_panels",
		async_remove_panel=Mock(side_effect=AssertionError("Panel lifecycle requires real-Core SIL")),
	)
	components.panel_custom = SimpleNamespace(
		async_register_panel=Mock(side_effect=AssertionError("Panel lifecycle requires real-Core SIL")),
	)
	http = ModuleType("homeassistant.components.http")
	http.StaticPathConfig = Mock(side_effect=AssertionError("Static serving requires real-Core SIL"))
	sys.modules["homeassistant.components"] = components
	sys.modules["homeassistant.components.http"] = http
