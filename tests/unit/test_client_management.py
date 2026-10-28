from __future__ import annotations

import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from homeassistant.exceptions import HomeAssistantError

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from custom_components.bl_haos.client import BLHAOSClient  # noqa: E402
from tests.conftest import FakeResponse  # noqa: E402


class ManagementSession:
    def __init__(self):
        self.calls = []
        self.response = {"status": "ok"}
        self.status = 200

    def _request(self, method, url, **kwargs):
        self.calls.append((method, url, kwargs))
        return FakeResponse(self.response, status=self.status)

    def get(self, url, **kwargs):
        return self._request("GET", url, **kwargs)

    def post(self, url, **kwargs):
        return self._request("POST", url, **kwargs)

    def put(self, url, **kwargs):
        return self._request("PUT", url, **kwargs)

    def delete(self, url, **kwargs):
        return self._request("DELETE", url, **kwargs)


def _client(session):
    hass = SimpleNamespace(data={"bl_haos_test_session": session})
    return BLHAOSClient(hass, "http://bl-haos:8099", "unit-token")


@pytest.mark.parametrize(
    ("call", "method", "path", "payload"),
    [
        (lambda client: client.async_scan(True), "POST", "/api/native/scan/start", {}),
        (lambda client: client.async_scan(False), "POST", "/api/native/scan/stop", {}),
        (lambda client: client.async_pair("AA-BB-CC-DD-EE-01", "1738"), "POST", "/api/native/devices/pair", {"address": "aa:bb:cc:dd:ee:01", "pin": "1738"}),
        (lambda client: client.async_connect("aa:bb:cc:dd:ee:01"), "POST", "/api/native/devices/aa:bb:cc:dd:ee:01/connect", None),
        (lambda client: client.async_disconnect("aa:bb:cc:dd:ee:01"), "POST", "/api/native/devices/aa:bb:cc:dd:ee:01/disconnect", None),
        (lambda client: client.async_remove("aa:bb:cc:dd:ee:01"), "DELETE", "/api/native/devices/aa:bb:cc:dd:ee:01", None),
        (lambda client: client.async_get_settings(), "GET", "/api/native/settings", None),
        (lambda client: client.async_update_system_settings(log_level="debug"), "PUT", "/api/native/settings/system", {"log_level": "debug"}),
        (lambda client: client.async_update_speaker_settings("aa:bb:cc:dd:ee:01", custom_alias="Office"), "PUT", "/api/native/settings/speakers/aa:bb:cc:dd:ee:01", {"custom_alias": "Office"}),
        (lambda client: client.async_list_adapters(), "GET", "/api/native/adapters", None),
        (lambda client: client.async_set_adapter_power("hci0", True), "POST", "/api/native/adapters/hci0/power", {"powered": True}),
    ],
)
async def test_management_methods_use_exact_authenticated_native_routes(call, method, path, payload):
    session = ManagementSession()
    client = _client(session)
    await call(client)
    assert len(session.calls) == 1
    actual_method, url, kwargs = session.calls[0]
    assert actual_method == method
    assert url == f"http://bl-haos:8099{path}"
    assert kwargs["headers"] == {"Authorization": "Bearer unit-token"}
    if payload is not None:
        assert kwargs["json"] == payload
    assert "/api/devices" not in url and "/api/scan" not in url


async def test_unsafe_bridge_error_is_replaced_with_fixed_message():
    session = ManagementSession()
    session.status = 400
    session.response = {"detail": "/org/bluez/hci0/dev_secret: raw DBus detail"}
    client = _client(session)
    with pytest.raises(HomeAssistantError, match="Bluetooth action failed"):
        await client.async_pair("aa:bb:cc:dd:ee:01")


async def test_bridge_whitelisted_reason_is_preserved_and_local_inputs_are_validated():
    session = ManagementSession()
    session.status = 409
    session.response = {"detail": "Bluetooth pairing is already in progress"}
    client = _client(session)
    with pytest.raises(HomeAssistantError, match="Bluetooth pairing is already in progress"):
        await client.async_pair("aa:bb:cc:dd:ee:01")
    calls = len(session.calls)
    with pytest.raises(HomeAssistantError, match="Invalid Bluetooth address"):
        await client.async_connect("not-a-mac")
    with pytest.raises(HomeAssistantError, match="Speaker alias is invalid"):
        await client.async_update_speaker_settings("aa:bb:cc:dd:ee:01", custom_alias="bad\u0001alias")
    with pytest.raises(HomeAssistantError, match="System settings update failed"):
        await client.async_update_system_settings(default_codec="invalid")
    assert len(session.calls) == calls
