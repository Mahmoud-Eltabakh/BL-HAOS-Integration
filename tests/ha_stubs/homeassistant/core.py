"""Minimal homeassistant.core stand-in."""

from __future__ import annotations

import asyncio
from typing import Any


class HomeAssistant:
    """Just enough of the hass object for BLHAOSClient: task creation helpers."""

    def __init__(self) -> None:
        self.data: dict[str, Any] = {}
        self._pending_tasks: list[asyncio.Task] = []

    def async_create_task(self, coro) -> asyncio.Task:
        task = asyncio.get_running_loop().create_task(coro)
        self._pending_tasks.append(task)
        return task

    def async_create_background_task(self, coro, *, name: str | None = None) -> asyncio.Task:
        task = asyncio.get_running_loop().create_task(coro, name=name)
        self._pending_tasks.append(task)
        return task

    async def async_block_till_done(self) -> None:
        for task in list(self._pending_tasks):
            try:
                await asyncio.shield(task)
            except (asyncio.CancelledError, Exception):
                pass
