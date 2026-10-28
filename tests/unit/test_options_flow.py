from types import SimpleNamespace

import pytest
import voluptuous as vol

from custom_components.bl_haos.config_flow import BLHAOSOptionsFlow


def test_options_flow_schema_has_bounded_speaker_settings():
    flow = BLHAOSOptionsFlow(SimpleNamespace(runtime_data=None))
    flow._speaker_settings = {"custom_alias": "Office", "auto_reconnect": True, "default_volume": 68}
    schema = flow._speaker_schema()
    result = schema({
        "custom_alias": "Studio",
        "auto_reconnect": False,
        "preferred_adapter": "hci0",
        "default_volume": 72,
        "codec_override": "ldac",
    })
    assert result["custom_alias"] == "Studio"
    assert result["auto_reconnect"] is False
    assert result["default_volume"] == 72


def test_options_flow_rejects_out_of_range_volume():
    flow = BLHAOSOptionsFlow(SimpleNamespace(runtime_data=None))
    with pytest.raises(vol.Invalid):
        flow._speaker_schema()({
            "custom_alias": "",
            "auto_reconnect": True,
            "preferred_adapter": "",
            "default_volume": 101,
            "codec_override": "",
        })
