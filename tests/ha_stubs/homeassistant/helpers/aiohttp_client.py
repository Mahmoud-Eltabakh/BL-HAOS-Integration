"""Minimal homeassistant.helpers.aiohttp_client stand-in.

Returns the FakeSession stashed on hass.data so tests can observe every
request without real network I/O.
"""

from __future__ import annotations

_SESSION_KEY = "bl_haos_test_session"


def _get_session(hass):
    session = hass.data.get(_SESSION_KEY)
    if session is None:
        raise RuntimeError(
            "No FakeSession registered on hass.data; unit tests must set "
            f"hass.data[{_SESSION_KEY!r}] before creating a BLHAOSClient"
        )
    return session


def async_get_clientsession(hass):
    return _get_session(hass)
