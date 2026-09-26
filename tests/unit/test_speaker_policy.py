"""Entity lifecycle policy for the speakers the bridge publishes.

The behaviour these cases pin down only depended on the Linux SIL job before,
because the media player platform cannot be imported without Home Assistant.
The policy itself lives in its own module for exactly this reason.
"""

from __future__ import annotations

import pytest

from custom_components.bl_haos.speaker_policy import (
    ENTITY_DISABLED,
    ENTITY_ENABLED,
    ENTITY_REMOVED,
    desired_entity_state,
)


def _speaker(**overrides) -> dict:
    """Return a record shaped like the bridge publishes (paired, switched off)."""
    record = {
        "address": "aa:bb:cc:dd:ee:01",
        "name": "Kitchen Speaker",
        "available": False,
        "connected": False,
        "paired": True,
        "detached": False,
        "trusted": True,
        "is_audio_sink": True,
        "playback": {"state": "idle", "volume": 0.42},
    }
    record.update(overrides)
    return record


@pytest.mark.parametrize(
    ("overrides", "expected"),
    [
        # Paired, switched off: keep the entity, but take it out of the way.
        ({}, ENTITY_DISABLED),
        ({"available": True}, ENTITY_DISABLED),
        ({"available": False}, ENTITY_DISABLED),
        # Connected: a live entity, whatever else the record says.
        ({"connected": True, "available": True}, ENTITY_ENABLED),
        ({"connected": True, "detached": True}, ENTITY_ENABLED),
        # No pairing left: the entity goes, even though the speaker is trusted.
        ({"paired": False}, ENTITY_REMOVED),
        ({"detached": True}, ENTITY_REMOVED),
        ({"paired": False, "detached": True}, ENTITY_REMOVED),
        ({"paired": False, "available": True}, ENTITY_REMOVED),
        # A missing or null pairing flag is unknown, never "unpaired".
        ({"paired": None}, ENTITY_ENABLED),
        ({"detached": None}, ENTITY_DISABLED),
    ],
)
def test_desired_entity_state(overrides, expected):
    assert desired_entity_state(_speaker(**overrides)) == expected


def test_record_without_pairing_information_is_left_alone():
    """An add-on that does not report pairing must not change any entity.

    Every older Bridge publishes ``available``/``connected`` only. Treating the
    absent flag as "unpaired" would remove entities the add-on knows nothing
    about, on nothing more than an upgrade.
    """
    legacy = {
        "address": "aa:bb:cc:dd:ee:01",
        "name": "Kitchen Speaker",
        "available": False,
        "connected": False,
        "trusted": True,
        "is_audio_sink": True,
        "playback": {"state": "idle", "volume": 0.42},
    }
    assert desired_entity_state(legacy) == ENTITY_ENABLED


def test_empty_record_is_left_alone():
    """A record that carries nothing must not disable or remove an entity."""
    assert desired_entity_state({}) == ENTITY_ENABLED
