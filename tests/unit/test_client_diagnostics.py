"""Windows-safe unit coverage for the diagnostics contract.

Operators answer "why did the log show a disconnect" from diagnostics rather than
by reading the log, so the stream block has to be present, bounded, and free of
the endpoint or credential.
"""

from __future__ import annotations

import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from custom_components.bl_haos.client import BLHAOSClient  # noqa: E402
from custom_components.bl_haos.diagnostics import async_get_config_entry_diagnostics  # noqa: E402
from custom_components.bl_haos.const import CONF_ENDPOINT  # noqa: E402
from tests.conftest import FakeSession, load_snapshot  # noqa: E402

ENDPOINT = "http://bl-haos:8099"
TOKEN = "unit-test-token"


def _entry(client: BLHAOSClient) -> SimpleNamespace:
    return SimpleNamespace(
        entry_id="entry-1",
        data={CONF_ENDPOINT: ENDPOINT},
        runtime_data=SimpleNamespace(client=client),
    )


async def test_diagnostics_reports_stream_outage_history():
    session = FakeSession(load_snapshot("speakers_initial.json"))
    client = BLHAOSClient(
        SimpleNamespace(
            data={"bl_haos_test_session": session},
            async_create_task=AsyncMock(),
            async_create_background_task=AsyncMock(),
            async_block_till_done=AsyncMock(),
        ),
        ENDPOINT,
        TOKEN,
    )
    await client._async_refresh_snapshot(session)
    # An add-on restart, as the listener records it.
    client._async_stream_connected()
    client._async_stream_disconnected(None)

    payload = await async_get_config_entry_diagnostics(SimpleNamespace(), _entry(client))

    stream = payload["stream"]
    assert stream["available"] is False
    assert stream["outages"] == 1
    assert stream["failed_attempts"] == 1
    assert stream["last_reason"] == "stream-closed"
    assert stream["last_disconnect_at"] is not None
    assert stream["credential_rejected"] is False
    assert payload["health_status"] == "unavailable"

    # Reason categories never embed the endpoint, and secrets stay redacted.
    assert ENDPOINT not in str(payload)
    assert TOKEN not in str(payload)
