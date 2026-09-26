"""Decide what Home Assistant should do with each speaker the bridge publishes.

The bridge publishes a speaker for as long as the operator trusts it, including
while it is switched off, and reports ``paired``/``detached`` so the two offline
cases can be told apart. This module is the single place that turns one
published record into an entity action, so the policy itself can be tested
without a Home Assistant runtime.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from .const import PAYLOAD_CONNECTED_KEY, PAYLOAD_DETACHED_KEY, PAYLOAD_PAIRED_KEY

# What to do with the speaker's media player entity.
ENTITY_ENABLED = "enabled"
ENTITY_DISABLED = "disabled"
ENTITY_REMOVED = "removed"


def desired_entity_state(speaker: Mapping[str, Any]) -> str:
    """Return the entity state one published speaker should be in.

    * ``connected``: the entity is live and reports the speaker's state.
    * paired but not connected: the entity is disabled. It leaves the state
      machine - so no dead card and no automation target that silently fails -
      while keeping its identity, name and history, and it is enabled again by
      itself when the speaker comes back.
    * no longer paired: the entity is removed completely. That covers a speaker
      BlueZ withdrew (an unpaired device is temporary to BlueZ, which the bridge
      reports as ``detached``) and one that answers ``paired: false``. The
      entity is built from scratch if the operator pairs the speaker again.

    A record from a bridge that reports no pairing information leaves the entity
    alone: an older add-on must not make Home Assistant remove entities it knows
    nothing about.
    """
    if speaker.get(PAYLOAD_CONNECTED_KEY):
        return ENTITY_ENABLED
    if speaker.get(PAYLOAD_DETACHED_KEY) is True:
        return ENTITY_REMOVED
    paired = speaker.get(PAYLOAD_PAIRED_KEY)
    if paired is False:
        return ENTITY_REMOVED
    if paired is True:
        return ENTITY_DISABLED
    return ENTITY_ENABLED
