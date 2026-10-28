"""SIL tests for Home Assistant speaker-management services and options."""

from __future__ import annotations

from homeassistant.core import Context
import pytest
from unittest.mock import patch
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.bl_haos.const import DOMAIN
from custom_components.bl_haos.speaker_management import _ws_dispatch
from tests.conftest import FakeSession
from tests.test_ha_integration_sil import _setup_entry

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")


async def test_management_services_use_native_routes_and_admin_gate(hass, bridge_session: FakeSession, hass_admin_user, hass_read_only_user):
    bridge_session.management_devices = [{
        "address": "aa:bb:cc:dd:ee:03", "name": "Pairing Speaker", "paired": False,
        "trusted": False, "connected": False, "is_audio_sink": True,
    }]
    bridge_session.management_settings = {
        "speakers": {"aa:bb:cc:dd:ee:03": {"custom_alias": "", "auto_reconnect": True, "default_volume": 50}},
        "log_level": "info", "default_codec": "auto", "auto_reconnect_enabled": True,
    }
    bridge_session.management_adapters = [{"interface": "hci0", "powered": True}]
    entry = await _setup_entry(hass, bridge_session)
    admin_context = Context(user_id=hass_admin_user.id)

    with patch("custom_components.bl_haos.client.async_get_clientsession", return_value=bridge_session):
        await hass.services.async_call(DOMAIN, "scan_start", {}, blocking=True, context=admin_context)
        await hass.services.async_call(DOMAIN, "pair", {"address": "aa:bb:cc:dd:ee:03", "pin": "1738"}, blocking=True, context=admin_context)
        await hass.services.async_call(DOMAIN, "connect", {"address": "aa:bb:cc:dd:ee:03"}, blocking=True, context=admin_context)
        await hass.services.async_call(DOMAIN, "update_system_settings", {"log_level": "debug", "default_codec": "ldac", "auto_reconnect_enabled": False}, blocking=True, context=admin_context)
        await hass.services.async_call(DOMAIN, "set_adapter_power", {"adapter_name": "hci0", "powered": False}, blocking=True, context=admin_context)

    assert [(method, url.rsplit("/api/native", 1)[-1]) for method, url, _ in bridge_session.management_calls] == [
        ("POST", "/scan/start"),
        ("POST", "/devices/pair"),
        ("POST", "/devices/aa:bb:cc:dd:ee:03/connect"),
        ("PUT", "/settings/system"),
        ("POST", "/adapters/hci0/power"),
    ]
    assert bridge_session.management_calls[1][2] == {"address": "aa:bb:cc:dd:ee:03", "pin": "1738"}
    assert bridge_session.management_calls[3][2] == {
        "log_level": "debug", "default_codec": "ldac", "auto_reconnect_enabled": False,
    }

    non_admin_services = [
        ("scan_start", {}), ("scan_stop", {}),
        ("pair", {"address": "aa:bb:cc:dd:ee:03"}),
        ("connect", {"address": "aa:bb:cc:dd:ee:03"}),
        ("disconnect", {"address": "aa:bb:cc:dd:ee:03"}),
        ("remove", {"address": "aa:bb:cc:dd:ee:03"}),
        ("rename", {"address": "aa:bb:cc:dd:ee:03", "custom_alias": "Studio"}),
        ("update_speaker_settings", {"address": "aa:bb:cc:dd:ee:03", "auto_reconnect": False}),
        ("update_system_settings", {"log_level": "info"}),
        ("set_adapter_power", {"adapter_name": "hci0", "powered": True}),
    ]
    for service, data in non_admin_services:
        with pytest.raises(Exception):
            await hass.services.async_call(
                DOMAIN, service, data, blocking=True, context=Context(user_id=hass_read_only_user.id)
            )

    from homeassistant.components import websocket_api
    from types import SimpleNamespace

    ws_commands = (
        "bl_haos/speakers/devices", "bl_haos/speakers/scan", "bl_haos/speakers/pair",
        "bl_haos/speakers/connect", "bl_haos/speakers/disconnect", "bl_haos/speakers/remove",
        "bl_haos/speakers/settings/get", "bl_haos/speakers/settings/update",
        "bl_haos/speakers/system-settings/update", "bl_haos/speakers/adapters/list",
        "bl_haos/speakers/adapters/power",
    )
    for command_type in ws_commands:
        handler, _schema = hass.data[websocket_api.DOMAIN][command_type]
        with pytest.raises(Exception):
            handler(hass, SimpleNamespace(user=SimpleNamespace(is_admin=False)), {"type": command_type, "id": 80})

    connection = type("Connection", (), {"send_result": lambda self, message_id, result: setattr(self, "result", result), "send_error": lambda self, *args: setattr(self, "error", args)})()
    with patch("custom_components.bl_haos.client.async_get_clientsession", return_value=bridge_session):
        await _ws_dispatch(hass, connection, {"id": 71}, "system_settings_update", log_level="warning")
        assert connection.result == {"status": "ok"}
        bridge_session.management_status = 500
        bridge_session.management_response = {"detail": "/org/bluez/hci0/dev_secret: raw DBus detail"}
        await _ws_dispatch(hass, connection, {"id": 72}, "connect", address="aa:bb:cc:dd:ee:03")
    assert connection.error[-1] == "Bluetooth action failed"
    assert entry.runtime_data.client.token == "sil-test-token"


async def test_speaker_settings_options_flow_saves_through_client(hass, bridge_session: FakeSession):
    address = "aa:bb:cc:dd:ee:03"
    bridge_session.management_devices = [{"address": address, "name": "Office", "paired": True, "trusted": True}]
    bridge_session.management_settings = {"speakers": {address: {"custom_alias": "Office", "auto_reconnect": True, "default_volume": 50, "codec_override": None}}}
    entry = await _setup_entry(hass, bridge_session)

    with patch("custom_components.bl_haos.client.async_get_clientsession", return_value=bridge_session):
        flow = await hass.config_entries.options.async_init(entry.entry_id)
        flow = await hass.config_entries.options.async_configure(flow["flow_id"], {"address": address})
        result = await hass.config_entries.options.async_configure(flow["flow_id"], {
            "custom_alias": "Studio",
            "auto_reconnect": False,
            "preferred_adapter": "hci0",
            "default_volume": 72,
            "codec_override": "ldac",
        })

    assert result["type"] == "create_entry"
    assert bridge_session.management_calls[-1] == (
        "PUT", f"{entry.runtime_data.client.endpoint}/api/native/settings/speakers/{address}", {
            "custom_alias": "Studio", "auto_reconnect": False, "preferred_adapter": "hci0",
            "default_volume": 72, "codec_override": "ldac",
        },
    )
