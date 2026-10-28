"""Admin-only Home Assistant services and WebSocket commands for speaker management."""

from __future__ import annotations

from typing import Any

import probatio as vol
from homeassistant.exceptions import HomeAssistantError

from .call_trace import trace_call
from .const import DOMAIN

_DATA_KEY = f"{DOMAIN}_speaker_management"
_ERROR = "Bluetooth action failed"


@trace_call
def _entry_client(hass: Any, config_entry_id: str | None = None):
    entries = hass.config_entries.async_entries(DOMAIN)
    if config_entry_id:
        entry = next((candidate for candidate in entries if candidate.entry_id == config_entry_id), None)
    else:
        entry = entries[0] if len(entries) == 1 else None
    if entry is None or getattr(entry, "runtime_data", None) is None:
        raise HomeAssistantError("BL-HAOS integration entry is unavailable")
    return entry.runtime_data.client


@trace_call
async def _service_scan(hass, call, start: bool):
    client = _entry_client(hass, call.data.get("config_entry_id"))
    await client.async_scan(start, call.data.get("adapter_name"))


@trace_call
async def _service_pair(hass, call):
    client = _entry_client(hass, call.data.get("config_entry_id"))
    await client.async_pair(call.data["address"], call.data.get("pin"))


@trace_call
async def _service_connect(hass, call):
    await _entry_client(hass, call.data.get("config_entry_id")).async_connect(call.data["address"])


@trace_call
async def _service_disconnect(hass, call):
    await _entry_client(hass, call.data.get("config_entry_id")).async_disconnect(call.data["address"])


@trace_call
async def _service_remove(hass, call):
    await _entry_client(hass, call.data.get("config_entry_id")).async_remove(call.data["address"])


@trace_call
async def _service_rename(hass, call):
    client = _entry_client(hass, call.data.get("config_entry_id"))
    await client.async_update_speaker_settings(call.data["address"], custom_alias=call.data["custom_alias"])


@trace_call
async def _service_update_speaker(hass, call):
    client = _entry_client(hass, call.data.get("config_entry_id"))
    fields = {key: value for key, value in call.data.items() if key not in {"config_entry_id", "address"}}
    await client.async_update_speaker_settings(call.data["address"], **fields)


@trace_call
async def _service_update_system(hass, call):
    client = _entry_client(hass, call.data.get("config_entry_id"))
    fields = {key: value for key, value in call.data.items() if key != "config_entry_id"}
    await client.async_update_system_settings(**fields)


@trace_call
async def _service_adapter_power(hass, call):
    client = _entry_client(hass, call.data.get("config_entry_id"))
    await client.async_set_adapter_power(call.data["adapter_name"], call.data["powered"])


@trace_call
async def async_setup(hass: Any, _config: dict[str, Any]) -> bool:
    from homeassistant.helpers.service import async_register_admin_service

    if _DATA_KEY in hass.data:
        return True
    service_schemas = {
        "scan_start": {vol.Optional("config_entry_id"): str, vol.Optional("adapter_name"): str},
        "scan_stop": {vol.Optional("config_entry_id"): str, vol.Optional("adapter_name"): str},
        "pair": {vol.Optional("config_entry_id"): str, vol.Required("address"): str, vol.Optional("pin"): str},
        "connect": {vol.Optional("config_entry_id"): str, vol.Required("address"): str},
        "disconnect": {vol.Optional("config_entry_id"): str, vol.Required("address"): str},
        "remove": {vol.Optional("config_entry_id"): str, vol.Required("address"): str},
        "rename": {vol.Optional("config_entry_id"): str, vol.Required("address"): str, vol.Required("custom_alias"): str},
        "update_speaker_settings": {
            vol.Optional("config_entry_id"): str,
            vol.Required("address"): str,
            vol.Optional("custom_alias"): str,
            vol.Optional("auto_reconnect"): bool,
            vol.Optional("preferred_adapter"): str,
            vol.Optional("default_volume"): vol.All(int, vol.Range(min=0, max=100)),
            vol.Optional("codec_override"): vol.In(["auto", "sbc", "sbc_xq", "aac", "aptx", "aptx_hd", "ldac"]),
        },
        "update_system_settings": {
            vol.Optional("config_entry_id"): str,
            vol.Optional("log_level"): vol.In(["trace", "debug", "info", "notice", "warning", "error", "fatal"]),
            vol.Optional("default_codec"): vol.In(["auto", "sbc", "sbc_xq", "aac", "aptx", "aptx_hd", "ldac"]),
            vol.Optional("auto_reconnect_enabled"): bool,
        },
        "set_adapter_power": {
            vol.Optional("config_entry_id"): str,
            vol.Required("adapter_name"): str,
            vol.Required("powered"): bool,
        },
    }
    @trace_call
    def service_handler_for(name):
        @trace_call
        async def service_handler(call):
            if name == "scan_start":
                await _service_scan(hass, call, True)
            elif name == "scan_stop":
                await _service_scan(hass, call, False)
            elif name == "pair":
                await _service_pair(hass, call)
            elif name == "connect":
                await _service_connect(hass, call)
            elif name == "disconnect":
                await _service_disconnect(hass, call)
            elif name == "remove":
                await _service_remove(hass, call)
            elif name == "rename":
                await _service_rename(hass, call)
            elif name == "update_speaker_settings":
                await _service_update_speaker(hass, call)
            elif name == "update_system_settings":
                await _service_update_system(hass, call)
            elif name == "set_adapter_power":
                await _service_adapter_power(hass, call)
        return service_handler

    for name, schema in service_schemas.items():
        async_register_admin_service(
            hass,
            DOMAIN,
            name,
            service_handler_for(name),
            schema=vol.Schema(schema, extra=vol.PREVENT_EXTRA),
        )
    hass.data[_DATA_KEY] = {"services": tuple(service_schemas), "entry_ids": set()}
    await _register_websocket_commands(hass)
    return True


@trace_call
async def async_entry_setup(hass: Any, entry_id: str) -> None:
    state = hass.data.get(_DATA_KEY)
    if state is not None:
        state["entry_ids"].add(entry_id)


@trace_call
async def async_unload_entry(hass: Any, entry_id: str) -> None:
    """Remove HA services after the final config entry unloads."""
    state = hass.data.get(_DATA_KEY)
    if state is None:
        return
    state["entry_ids"].discard(entry_id)
    if state["entry_ids"]:
        return
    for service in state["services"]:
        hass.services.async_remove(DOMAIN, service)
    hass.data.pop(_DATA_KEY, None)


@trace_call
async def _ws_dispatch(hass, connection, message, operation, **fields):
    from homeassistant.components import websocket_api

    try:
        client = _entry_client(hass, message.get("config_entry_id"))
        if operation == "devices":
            result = await client.async_list_devices()
        elif operation == "scan":
            result = await client.async_scan(message["start"], message.get("adapter_name"))
        elif operation == "pair":
            result = await client.async_pair(message["address"], message.get("pin"))
        elif operation == "connect":
            result = await client.async_connect(message["address"])
        elif operation == "disconnect":
            result = await client.async_disconnect(message["address"])
        elif operation == "remove":
            result = await client.async_remove(message["address"])
        elif operation == "settings_get":
            result = await client.async_get_settings()
        elif operation == "settings_update":
            result = await client.async_update_speaker_settings(message["address"], **fields)
        elif operation == "system_settings_update":
            result = await client.async_update_system_settings(**fields)
        elif operation == "adapters":
            result = await client.async_list_adapters()
        elif operation == "adapter_power":
            result = await client.async_set_adapter_power(message["adapter_name"], message["powered"])
        else:
            raise HomeAssistantError(_ERROR)
    except Exception:
        connection.send_error(message["id"], websocket_api.ERR_UNKNOWN_ERROR, _ERROR)
        return
    connection.send_result(message["id"], result)


@trace_call
async def _register_websocket_commands(hass):
    from homeassistant.components import websocket_api

    commands = [
        ("devices", "bl_haos/speakers/devices", {}),
        ("scan", "bl_haos/speakers/scan", {vol.Required("start"): bool, vol.Optional("adapter_name"): str}),
        ("pair", "bl_haos/speakers/pair", {vol.Required("address"): str, vol.Optional("pin"): str}),
        ("connect", "bl_haos/speakers/connect", {vol.Required("address"): str}),
        ("disconnect", "bl_haos/speakers/disconnect", {vol.Required("address"): str}),
        ("remove", "bl_haos/speakers/remove", {vol.Required("address"): str}),
        ("settings_get", "bl_haos/speakers/settings/get", {}),
        ("settings_update", "bl_haos/speakers/settings/update", {
            vol.Required("address"): str,
            vol.Optional("custom_alias"): str,
            vol.Optional("auto_reconnect"): bool,
            vol.Optional("preferred_adapter"): str,
            vol.Optional("default_volume"): vol.All(int, vol.Range(min=0, max=100)),
            vol.Optional("codec_override"): vol.In(["auto", "sbc", "sbc_xq", "aac", "aptx", "aptx_hd", "ldac"]),
        }),
        ("system_settings_update", "bl_haos/speakers/system-settings/update", {
            vol.Optional("log_level"): vol.In(["trace", "debug", "info", "notice", "warning", "error", "fatal"]),
            vol.Optional("default_codec"): vol.In(["auto", "sbc", "sbc_xq", "aac", "aptx", "aptx_hd", "ldac"]),
            vol.Optional("auto_reconnect_enabled"): bool,
        }),
        ("adapters", "bl_haos/speakers/adapters/list", {}),
        ("adapter_power", "bl_haos/speakers/adapters/power", {vol.Required("adapter_name"): str, vol.Required("powered"): bool}),
    ]
    for operation, command_type, fields_schema in commands:
        schema = {vol.Required("type"): command_type, vol.Required("id"): int, vol.Optional("config_entry_id"): str, **fields_schema}

        @trace_call
        async def handler(hass, connection, message, op=operation):
            fields = {key: value for key, value in message.items() if key not in {"type", "id", "config_entry_id", "address", "pin", "adapter_name", "powered", "start"}}
            await _ws_dispatch(hass, connection, message, op, **fields)

        command = websocket_api.async_response(handler)
        command = websocket_api.require_admin(command)
        command = websocket_api.websocket_command(schema)(command)
        websocket_api.async_register_command(hass, command)
