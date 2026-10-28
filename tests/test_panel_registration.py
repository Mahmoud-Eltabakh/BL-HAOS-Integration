"""Contract checks for the supported Home Assistant panel/static APIs."""

import os
import sys
import asyncio
import threading
from importlib.metadata import version
from pathlib import Path
from unittest.mock import AsyncMock, patch

import pytest

if sys.platform == "win32" and os.environ.get("BLHAOS_RUN_SIL") != "1":
    pytest.skip("Home Assistant SIL requires Linux or WSL2", allow_module_level=True)

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http.const import DOMAIN as HTTP_DOMAIN
from homeassistant.components.http.server import StaticPathConfig
from homeassistant.setup import async_setup_component
from homeassistant.exceptions import ConfigEntryNotReady
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.bl_haos import _PANEL_DATA, _finish_operation, async_setup_entry, async_unload_entry
from custom_components.bl_haos.const import DOMAIN


TARGET_CORE_VERSION = "2026.10.3"
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


@pytest.fixture
async def panel_environment(hass, hass_client, enable_custom_integrations):
    assert await async_setup_component(hass, HTTP_DOMAIN, {})
    with (
        patch("custom_components.bl_haos.BLHAOSClient") as client_class,
        patch.object(hass.config_entries, "async_forward_entry_setups", new_callable=AsyncMock) as forward,
        patch.object(hass.config_entries, "async_unload_platforms", new_callable=AsyncMock, return_value=True) as unload,
    ):
        client_class.side_effect = lambda *args: AsyncMock(transport_available=True)
        yield hass_client, client_class, forward, unload


def panel_entry(hass, unique_id="panel-one"):
    entry = MockConfigEntry(domain=DOMAIN, unique_id=unique_id, data={"endpoint": "http://bridge", "token": "test-only"})
    entry.add_to_hass(hass)
    return entry


async def assert_module_status(http, status):
    response = await http.get(PANEL_URL)
    assert response.status == status
    if status == 200:
        body = await response.text()
        assert "bl-haos-media-panel" in body
        assert "Play playlist" in body
        assert "Playback queue" in body
        assert "max-age=2678400" not in response.headers.get("Cache-Control", "")


async def test_owned_panel_http_unload_and_reload(hass, panel_environment):
    http, _, _, _ = panel_environment
    entry = panel_entry(hass)
    with patch.object(hass.http, "async_register_static_paths", wraps=hass.http.async_register_static_paths) as register:
        assert await async_setup_entry(hass, entry)
        http = await http()
        await assert_module_status(http, 200)
        panel = hass.data[frontend.DATA_PANELS]["bl-haos-media"]
        assert panel.config["_panel_custom"]["module_url"] == PANEL_URL
        assert panel.config["_panel_custom"]["name"] == "bl-haos-media-panel"
        assert await async_unload_entry(hass, entry)
        await assert_module_status(http, 404)
        assert "bl-haos-media" not in hass.data[frontend.DATA_PANELS]
        assert await async_setup_entry(hass, entry)
        await assert_module_status(http, 200)
        assert register.call_count == 1
        assert await async_unload_entry(hass, entry)
        await assert_module_status(http, 404)


async def test_owned_panel_serializes_multiple_entries(hass, panel_environment):
    http, _, _, _ = panel_environment
    first, second = panel_entry(hass), panel_entry(hass, "panel-two")
    with patch.object(hass.http, "async_register_static_paths", wraps=hass.http.async_register_static_paths) as register:
        assert all(await asyncio.gather(async_setup_entry(hass, first), async_setup_entry(hass, second)))
        http = await http()
        assert register.call_count == 1
        assert await async_unload_entry(hass, first)
        await assert_module_status(http, 200)
        assert "bl-haos-media" in hass.data[frontend.DATA_PANELS]
        assert await async_unload_entry(hass, second)
        await assert_module_status(http, 404)


@pytest.mark.parametrize("failure", [RuntimeError("platform failure"), asyncio.CancelledError()])
async def test_owned_panel_platform_failure_closes_resources(hass, panel_environment, failure):
    http, client_class, forward, unload = panel_environment
    entry = panel_entry(hass)
    forward.side_effect = failure
    with pytest.raises(type(failure)):
        await async_setup_entry(hass, entry)
    entry.runtime_data.client.async_close.assert_awaited_once()
    unload.assert_awaited_once()
    assert "bl-haos-media" not in hass.data.get(frontend.DATA_PANELS, {})
    await assert_module_status(await http(), 404)


async def test_owned_panel_registration_failure_is_inert_and_reloadable(hass, panel_environment):
    http_factory, _, _, _ = panel_environment
    entry = panel_entry(hass)
    with patch.object(panel_custom, "async_register_panel", side_effect=RuntimeError("registration failed")):
        with pytest.raises(RuntimeError, match="registration failed"):
            await async_setup_entry(hass, entry)
    entry.runtime_data.client.async_close.assert_awaited_once()
    http = await http_factory()
    await assert_module_status(http, 404)
    assert "bl-haos-media" not in hass.data.get(frontend.DATA_PANELS, {})
    assert await async_setup_entry(hass, entry)
    await assert_module_status(http, 200)
    assert await async_unload_entry(hass, entry)


async def test_owned_panel_failed_second_entry_preserves_first(hass, panel_environment):
    http_factory, _, forward, _ = panel_environment
    first, second = panel_entry(hass), panel_entry(hass, "panel-two")
    assert await async_setup_entry(hass, first)
    http = await http_factory()
    forward.side_effect = RuntimeError("second platform failed")
    with pytest.raises(RuntimeError):
        await async_setup_entry(hass, second)
    await assert_module_status(http, 200)
    assert "bl-haos-media" in hass.data[frontend.DATA_PANELS]
    assert await async_unload_entry(hass, first)
    await assert_module_status(http, 404)


async def test_owned_panel_refused_unload_keeps_owner(hass, panel_environment):
    http_factory, _, _, unload = panel_environment
    entry = panel_entry(hass)
    assert await async_setup_entry(hass, entry)
    http = await http_factory()
    unload.return_value = False
    assert not await async_unload_entry(hass, entry)
    entry.runtime_data.client.async_close.assert_not_awaited()
    await assert_module_status(http, 200)
    unload.return_value = True
    assert await async_unload_entry(hass, entry)
    await assert_module_status(http, 404)


async def test_owned_panel_initialization_failure_remains_not_ready(hass, panel_environment):
    http_factory, client_class, forward, _ = panel_environment
    client = AsyncMock()
    client.async_initialize.side_effect = RuntimeError("offline")
    client_class.side_effect = None
    client_class.return_value = client
    with pytest.raises(ConfigEntryNotReady):
        await async_setup_entry(hass, panel_entry(hass))
    client.async_close.assert_awaited_once()
    forward.assert_not_awaited()
    await assert_module_status(await http_factory(), 404)


async def test_owned_panel_partial_public_registration_failure_removes_panel(hass, panel_environment):
    http_factory, _, _, _ = panel_environment
    register = panel_custom.async_register_panel

    async def register_then_fail(*args, **kwargs):
        await register(*args, **kwargs)
        raise RuntimeError("after public registration")

    with patch.object(panel_custom, "async_register_panel", side_effect=register_then_fail):
        with pytest.raises(RuntimeError, match="after public registration"):
            await async_setup_entry(hass, panel_entry(hass))
    assert "bl-haos-media" not in hass.data.get(frontend.DATA_PANELS, {})
    await assert_module_status(await http_factory(), 404)


async def test_owned_panel_partial_static_failure_never_duplicates_route(hass, panel_environment):
    http_factory, _, _, _ = panel_environment
    register = hass.http.async_register_static_paths

    async def register_then_fail(configs):
        await register(configs)
        raise RuntimeError("after static registration")

    entry = panel_entry(hass)
    with patch.object(hass.http, "async_register_static_paths", side_effect=register_then_fail) as attempted:
        with pytest.raises(RuntimeError, match="after static registration"):
            await async_setup_entry(hass, entry)
        http = await http_factory()
        await assert_module_status(http, 404)
        with pytest.raises(ConfigEntryNotReady, match="static registration"):
            await async_setup_entry(hass, entry)
        assert attempted.call_count == 1
    await assert_module_status(http, 404)


@pytest.mark.parametrize("late_failure", [False, True])
@pytest.mark.parametrize("cancellations", [1, 2, 3])
async def test_owned_panel_actual_cancellation_waits_for_registration_then_cleans(hass, panel_environment, cancellations, late_failure):
    http_factory, _, forward, _ = panel_environment
    started, proceed = asyncio.Event(), asyncio.Event()
    register = panel_custom.async_register_panel

    async def delayed_register(*args, **kwargs):
        started.set()
        await proceed.wait()
        await register(*args, **kwargs)
        if late_failure:
            raise RuntimeError("late registration failure after public mutation")

    entry = panel_entry(hass)
    with (
        patch.object(panel_custom, "async_register_panel", side_effect=delayed_register),
        patch.object(hass.http, "async_register_static_paths", wraps=hass.http.async_register_static_paths) as static_register,
    ):
        setup = asyncio.create_task(async_setup_entry(hass, entry))
        await started.wait()
        for _ in range(cancellations):
            setup.cancel()
            checkpoint = asyncio.Event()
            asyncio.get_running_loop().call_soon(checkpoint.set)
            await checkpoint.wait()
        lock_held = hass.data[_PANEL_DATA].lock.locked()
        still_pending = not setup.done()
        proceed.set()
        with pytest.raises(asyncio.CancelledError):
            await setup
    panel = hass.data[_PANEL_DATA]
    assert lock_held
    assert still_pending
    assert not panel.lock.locked()
    assert not panel.owners
    assert not panel.served_path.exists()
    forward.assert_not_awaited()
    entry.runtime_data.client.async_close.assert_awaited_once()
    assert "bl-haos-media" not in hass.data.get(frontend.DATA_PANELS, {})
    http = await http_factory()
    await assert_module_status(http, 404)
    with patch.object(hass.http, "async_register_static_paths", wraps=hass.http.async_register_static_paths) as reload_register:
        assert await async_setup_entry(hass, entry)
        await assert_module_status(http, 200)
        assert static_register.call_count == 1
        reload_register.assert_not_called()
        assert await async_unload_entry(hass, entry)
    assert not panel.owners
    await assert_module_status(http, 404)


@pytest.mark.parametrize("operation", ["copy", "remove"])
async def test_owned_panel_repeated_cancellation_drains_executor_before_unlock(hass, panel_environment, operation):
    http_factory, _, forward, unload = panel_environment
    entry = panel_entry(hass)
    assert await async_setup_entry(hass, entry)
    http = await http_factory()
    await assert_module_status(http, 200)
    panel = hass.data[_PANEL_DATA]
    if operation == "copy":
        assert await async_unload_entry(hass, entry)
        await assert_module_status(http, 404)
    forward.reset_mock()
    unload.reset_mock()
    started, finished = asyncio.Event(), asyncio.Event()
    proceed = threading.Event()
    loop = asyncio.get_running_loop()
    method = panel._copy_bundle if operation == "copy" else panel._remove_bundle
    executor = hass.async_add_executor_job
    executor_waits = []

    def gated_file_operation():
        loop.call_soon_threadsafe(started.set)
        try:
            if not proceed.wait(timeout=10):
                raise RuntimeError("test executor gate timed out")
            method()
        finally:
            loop.call_soon_threadsafe(finished.set)

    def observe_executor(function, *args):
        future = executor(function, *args)
        if function is gated_file_operation:
            executor_waits.append(future)
        return future

    async def cancel_and_checkpoint(task):
        task.cancel()
        checkpoint = asyncio.Event()
        loop.call_soon(checkpoint.set)
        await checkpoint.wait()

    method_name = "_copy_bundle" if operation == "copy" else "_remove_bundle"
    task = None
    try:
        with (
            patch.object(panel, method_name, new=gated_file_operation),
            patch.object(hass, "async_add_executor_job", side_effect=observe_executor),
        ):
            task = asyncio.create_task(
                async_setup_entry(hass, entry) if operation == "copy" else async_unload_entry(hass, entry)
            )
            await asyncio.wait_for(started.wait(), timeout=5)
            await cancel_and_checkpoint(task)
            await cancel_and_checkpoint(task)
            wait_cancelled = executor_waits[0].cancelled()
            lock_held = panel.lock.locked()
            still_pending = not task.done()
            proceed.set()
            await asyncio.wait_for(finished.wait(), timeout=5)
            with pytest.raises(asyncio.CancelledError):
                await task
        assert not wait_cancelled, "outer cancellation cancelled the real Core executor wait"
        assert lock_held, "shared ownership lock released while file work was pending"
        assert still_pending, "caller returned before pending file work settled"
        assert not panel.owners
        assert not panel.panel_registered
        assert not panel.served_path.exists()
        assert "bl-haos-media" not in hass.data.get(frontend.DATA_PANELS, {})
        entry.runtime_data.client.async_close.assert_awaited_once()
        if operation == "copy":
            forward.assert_not_awaited()
        else:
            unload.assert_awaited_once()
        await assert_module_status(http, 404)
        assert await async_setup_entry(hass, entry)
        await assert_module_status(http, 200)
        assert await async_unload_entry(hass, entry)
        assert not panel.owners
        await assert_module_status(http, 404)
    finally:
        proceed.set()
        if task is not None:
            await asyncio.gather(task, return_exceptions=True)
        await panel.release(hass, entry.entry_id)


@pytest.mark.parametrize("cancellations", [0, 1, 2, 3])
async def test_finish_operation_late_failure_after_cancellation(hass, cancellations):
    started, proceed = asyncio.Event(), asyncio.Event()
    children = []

    async def failing_operation():
        children.append(asyncio.current_task())
        started.set()
        await proceed.wait()
        raise RuntimeError("late operation failure")

    wrapper = asyncio.create_task(_finish_operation(failing_operation()))
    try:
        await asyncio.wait_for(started.wait(), timeout=5)
        for _ in range(cancellations):
            wrapper.cancel()
            checkpoint = asyncio.Event()
            asyncio.get_running_loop().call_soon(checkpoint.set)
            await checkpoint.wait()
            assert not wrapper.done()
            assert not children[0].done()
        proceed.set()
        if cancellations:
            with pytest.raises(asyncio.CancelledError):
                await wrapper
        else:
            with pytest.raises(RuntimeError, match="late operation failure"):
                await wrapper
        assert children[0].done()
        assert not children[0].cancelled()
    finally:
        proceed.set()
        await asyncio.gather(wrapper, return_exceptions=True)


async def test_finish_operation_preserves_operation_originated_cancellation():
    async def cancelled_operation():
        raise asyncio.CancelledError("operation cancelled itself")

    with pytest.raises(asyncio.CancelledError):
        await _finish_operation(cancelled_operation())