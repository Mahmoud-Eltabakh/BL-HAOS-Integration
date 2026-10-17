"""DEBUG call tracing is private, opt-in, and safe for HA callbacks."""

from __future__ import annotations

import ast
import asyncio
import inspect
import logging
from pathlib import Path
import sys

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from custom_components.bl_haos.call_trace import trace_call, trace_scope  # noqa: E402
from custom_components.bl_haos.const import get_logger  # noqa: E402


def test_debug_tracing_preserves_signatures_and_excludes_values(caplog):
    @trace_call
    def identity(value: str) -> str:
        return value

    secret = "private-token-and-signed-url"
    with caplog.at_level(logging.INFO):
        assert identity(secret) == secret
    assert not caplog.records
    with caplog.at_level(logging.DEBUG):
        assert identity(secret) == secret
    assert inspect.signature(identity) == inspect.signature(identity.__wrapped__)
    assert secret not in caplog.text
    assert "call enter" in caplog.text
    assert "call exit" in caplog.text
    assert "elapsed_ms=" in caplog.text


@pytest.mark.asyncio
async def test_async_execution_errors_and_cancellation_remain_unchanged(caplog):
    error = ValueError("private exception text")

    @trace_call
    async def fail():
        await asyncio.sleep(0)
        raise error

    @trace_call
    async def cancel():
        raise asyncio.CancelledError()

    assert inspect.iscoroutinefunction(fail)
    with caplog.at_level(logging.DEBUG):
        pending = fail()
        assert not caplog.records
        with pytest.raises(ValueError) as raised:
            await pending
        with pytest.raises(asyncio.CancelledError):
            await cancel()
    assert raised.value is error
    assert "error_type=ValueError" in caplog.text
    assert "private exception text" not in caplog.text
    assert "call cancel" in caplog.text
    assert all(record.exc_info is None for record in caplog.records)


def test_tracing_keeps_integration_prefix_without_recursive_logging(caplog):
    logger = get_logger("custom_components.bl_haos.tracing_test")
    with caplog.at_level(logging.DEBUG):
        with trace_scope(logger.logger, "outer"):
            with trace_scope(logger.logger, "inner"):
                logger.debug("ordinary debug message")
    assert len(caplog.records) == 5
    assert all(record.getMessage().startswith("[BL-HAOS] ") for record in caplog.records)
    assert "parent=none" in caplog.records[0].getMessage()
    assert "parent=none" not in caplog.records[1].getMessage()


def test_every_shipped_function_has_call_tracing_except_logger_plumbing():
    root = Path(__file__).resolve().parents[2] / "custom_components" / "bl_haos"
    missing = []
    for path in root.rglob("*.py"):
        if path.name == "call_trace.py":
            continue
        tree = ast.parse(path.read_text(encoding="utf-8"))
        for node in ast.walk(tree):
            if not isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                continue
            if path.name == "const.py" and node.name in {"get_logger", "process"}:
                continue
            if not any(
                isinstance(item, ast.Name) and item.id == "trace_call"
                for item in node.decorator_list
            ):
                missing.append(f"{path.relative_to(root)}:{node.lineno}: {node.name}")
    assert not missing, "\n".join(missing)
