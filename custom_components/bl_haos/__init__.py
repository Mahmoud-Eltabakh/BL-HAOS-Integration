"""BL-HAOS integration setup."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from pathlib import Path
import shutil
import tempfile

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers import entity_registry as er
import logging

from .client import BLHAOSClient
from .const import CONF_ENDPOINT, CONF_LOG_LEVEL, CONF_TOKEN, DOMAIN, INTEGRATION_LOGGER, PLATFORMS, get_logger, normalize_log_level
from .playlist_library import async_setup

from .call_trace import trace_call

_LOGGER = get_logger(__name__)
PANEL_URL = "/api/bl_haos/catalog/bl-haos-media-panel.js"
PANEL_ELEMENT_NAME = "bl-haos-media-panel"
PANEL_PATH = "bl-haos-media"
PANEL_BUNDLE = Path(__file__).parent / "panel_static" / "bl-haos-media-panel.js"
_PANEL_DATA = f"{DOMAIN}_catalog_panel"


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
class _PanelOwners:
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)
    owners: set[str] = field(default_factory=set)
    served_path: Path | None = None
    route_registered: bool = False
    route_registration_failed: bool = False
    panel_registered: bool = False

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
            if PANEL_PATH in hass.data.get(frontend.DATA_PANELS, {}):
                raise ConfigEntryNotReady("BL-HAOS catalog panel identity is already in use")
            if self.route_registration_failed:
                raise ConfigEntryNotReady("BL-HAOS catalog static registration failed; Core restart required")
            try:
                await hass.async_add_executor_job(self._copy_bundle)
                if not self.route_registered:
                    self.route_registration_failed = True
                    await hass.http.async_register_static_paths([
                        StaticPathConfig(PANEL_URL, str(self.served_path), cache_headers=False)
                    ])
                    self.route_registered = True
                    self.route_registration_failed = False
                self.panel_registered = True
                await panel_custom.async_register_panel(
                    hass,
                    frontend_url_path=PANEL_PATH,
                    webcomponent_name=PANEL_ELEMENT_NAME,
                    module_url=PANEL_URL,
                    sidebar_title="BL-HAOS Media",
                    sidebar_icon="mdi:play-box-multiple",
                )
                self.owners.add(owner)
            except BaseException:
                try:
                    if self.panel_registered:
                        frontend.async_remove_panel(hass, PANEL_PATH, warn_if_unknown=False)
                        self.panel_registered = False
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
                if self.panel_registered:
                    frontend.async_remove_panel(hass, PANEL_PATH)
                    self.panel_registered = False
            finally:
                await hass.async_add_executor_job(self._remove_bundle)


@dataclass
class BLHAOSRuntime:
    """Objects owned by one BL-HAOS config entry."""

    client: BLHAOSClient


@trace_call
async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up BL-HAOS from a config entry."""
    effective_log_level = normalize_log_level(entry.data.get(CONF_LOG_LEVEL))
    logging.getLogger(INTEGRATION_LOGGER).setLevel(effective_log_level.upper())
    _LOGGER.debug(
        "Setting up BL-HAOS config entry %s (endpoint: %s, log_level: %s)",
        entry.entry_id,
        entry.data.get(CONF_ENDPOINT),
        effective_log_level,
    )
    client = BLHAOSClient(hass, entry.data[CONF_ENDPOINT], entry.data[CONF_TOKEN])
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
    except Exception as error:
        _LOGGER.debug("Failed to initialize BL-HAOS client for entry %s: %s", entry.entry_id, error)
        await client.async_close()
        raise ConfigEntryNotReady("BL-HAOS add-on is unavailable") from error
    entry.runtime_data = BLHAOSRuntime(client)
    panel = hass.data.setdefault(_PANEL_DATA, _PanelOwners())
    platforms_started = False
    try:
        await _finish_operation(panel.acquire(hass, entry.entry_id))
        platforms_started = True
        await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    except BaseException:
        try:
            if platforms_started:
                await _finish_operation(hass.config_entries.async_unload_platforms(entry, PLATFORMS))
        finally:
            try:
                await _finish_operation(panel.release(hass, entry.entry_id))
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
    _LOGGER.debug("Unloading BL-HAOS config entry %s", entry.entry_id)
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        try:
            await _finish_operation(hass.data[_PANEL_DATA].release(hass, entry.entry_id))
        finally:
            await _finish_operation(entry.runtime_data.client.async_close())
        # Platform unload detaches entities but leaves their last state behind
        # as a restored/unavailable placeholder; remove the states so a reload
        # does not briefly show stale unavailable players.
        registry = er.async_get(hass)
        for entity in er.async_entries_for_config_entry(registry, entry.entry_id):
            hass.states.async_remove(entity.entity_id)
        _LOGGER.debug("BL-HAOS config entry %s unloaded successfully", entry.entry_id)
    else:
        _LOGGER.debug("BL-HAOS config entry %s unload returned False", entry.entry_id)
    return unloaded
