"""BL-HAOS integration setup."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
import json
from pathlib import Path
import shutil
import tempfile

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers import entity_registry as er
import logging

from .client import BLHAOSClient, IncompatibleBridgeError
from .compatibility import issue_id
from .const import CONF_ENDPOINT, CONF_LOG_LEVEL, CONF_TOKEN, DOMAIN, INTEGRATION_LOGGER, PLATFORMS, get_logger, normalize_log_level

from .call_trace import trace_call

_LOGGER = get_logger(__name__)
PANEL_URL = "/api/bl_haos/catalog/bl-haos-media-panel.js"
INTEGRATION_VERSION = json.loads((Path(__file__).parent / "manifest.json").read_text(encoding="utf-8"))["version"]
FRONTEND_MODULE_URL = f"{PANEL_URL}?v={INTEGRATION_VERSION}"
PANEL_BUNDLE = Path(__file__).parent / "panel_static" / "bl-haos-media-panel.js"
_MODULE_DATA = f"{DOMAIN}_catalog_frontend_module"


@trace_call
async def _finish_operation(operation):
    task = asyncio.create_task(operation)
    completed = asyncio.get_running_loop().create_future()
    task.add_done_callback(lambda finished: completed.set_result(None))
    cancellation = None
    while not completed.done():
        try:
            await asyncio.shield(completed)
        except asyncio.CancelledError as error:
            cancellation = error
    try:
        result = task.result()
    except BaseException:
        if cancellation is not None:
            raise cancellation
        raise
    if cancellation is not None:
        raise cancellation
    return result


@dataclass
class _FrontendModuleOwners:
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)
    owners: set[str] = field(default_factory=set)
    served_path: Path | None = None
    route_registered: bool = False
    route_registration_failed: bool = False
    extra_js_registered: bool = False

    @trace_call
    def _copy_bundle(self) -> None:
        if self.served_path is None:
            self.served_path = Path(tempfile.mkdtemp(prefix="bl-haos-panel-")) / PANEL_BUNDLE.name
        self.served_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(PANEL_BUNDLE, self.served_path)

    @trace_call
    def _remove_bundle(self) -> None:
        if self.served_path is not None:
            self.served_path.unlink(missing_ok=True)
            try:
                self.served_path.parent.rmdir()
            except FileNotFoundError:
                pass

    @trace_call
    async def acquire(self, hass: HomeAssistant, owner: str) -> None:
        async with self.lock:
            if owner in self.owners:
                return
            if self.owners:
                self.owners.add(owner)
                return
            if self.route_registration_failed:
                raise ConfigEntryNotReady("BL-HAOS catalog static registration failed; Core restart required")
            if frontend.DATA_EXTRA_MODULE_URL not in hass.data:
                raise ConfigEntryNotReady("Home Assistant frontend is not ready to load the BL-HAOS media card")
            try:
                await hass.async_add_executor_job(self._copy_bundle)
                if not self.route_registered:
                    self.route_registration_failed = True
                    await hass.http.async_register_static_paths([
                        StaticPathConfig(PANEL_URL, str(self.served_path), cache_headers=False)
                    ])
                    self.route_registered = True
                    self.route_registration_failed = False
                self.extra_js_registered = True
                frontend.add_extra_js_url(hass, FRONTEND_MODULE_URL)
                self.owners.add(owner)
            except BaseException:
                try:
                    if self.extra_js_registered and frontend.DATA_EXTRA_MODULE_URL in hass.data:
                        frontend.remove_extra_js_url(hass, FRONTEND_MODULE_URL)
                        self.extra_js_registered = False
                finally:
                    await hass.async_add_executor_job(self._remove_bundle)
                raise

    @trace_call
    async def release(self, hass: HomeAssistant, owner: str) -> None:
        async with self.lock:
            self.owners.discard(owner)
            if self.owners:
                return
            try:
                if self.extra_js_registered:
                    frontend.remove_extra_js_url(hass, FRONTEND_MODULE_URL)
                    self.extra_js_registered = False
            finally:
                await hass.async_add_executor_job(self._remove_bundle)


@dataclass
class BLHAOSRuntime:
    """Objects owned by one BL-HAOS config entry."""

    client: BLHAOSClient


@trace_call
async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Register integration-wide playlist and speaker-management surfaces."""
    from . import speaker_management
    from .playlist_library import async_setup as async_setup_playlist_library

    await async_setup_playlist_library(hass, config)
    await speaker_management.async_setup(hass, config)
    return True


@trace_call
async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up BL-HAOS from a config entry."""
    from . import speaker_management

    await speaker_management.async_setup(hass, {})
    effective_log_level = normalize_log_level(entry.data.get(CONF_LOG_LEVEL))
    logging.getLogger(INTEGRATION_LOGGER).setLevel(effective_log_level.upper())
    _LOGGER.debug(
        "Setting up BL-HAOS config entry %s (endpoint: %s, log_level: %s)",
        entry.entry_id,
        entry.data.get(CONF_ENDPOINT),
        effective_log_level,
    )
    client = BLHAOSClient(hass, entry.data[CONF_ENDPOINT], entry.data[CONF_TOKEN], entry.entry_id)
    try:
        await client.async_initialize()
        _LOGGER.debug(
            "BL-HAOS client initialized successfully for entry %s (transport_available=%s)",
            entry.entry_id,
            client.transport_available,
        )
    except asyncio.CancelledError:
        await _finish_operation(client.async_close())
        raise
    except IncompatibleBridgeError as error:
        await client.async_close()
        raise ConfigEntryNotReady("BL-HAOS add-on and integration versions are incompatible; see Repairs") from error
    except Exception as error:
        _LOGGER.debug("Failed to initialize BL-HAOS client for entry %s: %s", entry.entry_id, error)
        await client.async_close()
        raise ConfigEntryNotReady("BL-HAOS add-on is unavailable") from error
    entry.runtime_data = BLHAOSRuntime(client)
    await speaker_management.async_entry_setup(hass, entry.entry_id)
    module = hass.data.setdefault(_MODULE_DATA, _FrontendModuleOwners())
    platforms_started = False
    try:
        await _finish_operation(module.acquire(hass, entry.entry_id))
        platforms_started = True
        await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    except BaseException:
        try:
            if platforms_started:
                await _finish_operation(hass.config_entries.async_unload_platforms(entry, PLATFORMS))
        finally:
            try:
                await _finish_operation(module.release(hass, entry.entry_id))
            finally:
                await _finish_operation(client.async_close())
        raise
    _LOGGER.debug(
        "BL-HAOS config entry %s setup completed with platforms: %s",
        entry.entry_id,
        PLATFORMS,
    )
    return True


@trace_call
async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a BL-HAOS config entry."""
    from . import speaker_management

    _LOGGER.debug("Unloading BL-HAOS config entry %s", entry.entry_id)
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        try:
            await _finish_operation(hass.data[_MODULE_DATA].release(hass, entry.entry_id))
        finally:
            await _finish_operation(entry.runtime_data.client.async_close())
        # Platform unload detaches entities but leaves their last state behind
        # as a restored/unavailable placeholder; remove the states so a reload
        # does not briefly show stale unavailable players.
        await speaker_management.async_unload_entry(hass, entry.entry_id)
        registry = er.async_get(hass)
        for entity in er.async_entries_for_config_entry(registry, entry.entry_id):
            hass.states.async_remove(entity.entity_id)
        _LOGGER.debug("BL-HAOS config entry %s unloaded successfully", entry.entry_id)
    else:
        _LOGGER.debug("BL-HAOS config entry %s unload returned False", entry.entry_id)
    return unloaded


@trace_call
async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Clear the persistent compatibility repair only when the entry is removed."""
    from homeassistant.helpers import issue_registry as ir

    ir.async_delete_issue(hass, DOMAIN, issue_id(entry.entry_id))
