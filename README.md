# BL-HAOS Home Assistant Integration

This HACS custom integration exposes trusted BL-HAOS Bluetooth speakers as native Home Assistant `media_player` entities. It uses the Bridge add-on's private Supervisor-network REST snapshot and WebSocket event stream; it does not use MQTT or a user-managed key.

Each speaker entity supports Home Assistant's media browser (`BROWSE_MEDIA`), so you can browse local media folders and other configured media sources directly from the Home Assistant UI instead of only playing media by URL.

## Install

1. In HACS, add `https://github.com/Mahmoud-Eltabakh/BL-HAOS-Integration` as a custom **Integration** repository and install **BL-HAOS Bluetooth Audio**.
2. Restart Home Assistant.
3. Home Assistant discovers the Bridge add-on. Confirm the **BL-HAOS Bluetooth Audio** setup prompt.

The integration derives the add-on's private hostname from Supervisor discovery, validates `GET /api/native/identity`, then reads `GET /api/native/speakers` and listens on `/ws/native` for updates. The Bridge add-on pushes its native token and configured `log_level` through the same Supervisor discovery message, so discovered integration logging stays synchronized with the add-on without changing Home Assistant's global logger. Existing entries refresh these values and reload themselves when the add-on rotates its token or changes log level. A manual local endpoint and token entry are available only as a fallback; manually configured entries default to `info`.

## Speakers that are switched off, and speakers that are gone

A trusted speaker that is switched off (or out of range) keeps its identity but
is **disabled**: the add-on keeps publishing it with `connected: false` and
`paired: true`, the entity leaves the state machine (no dead card, and no
automation target that silently fails) while its name, history and dashboard
identity are kept, and the same entity is enabled again by itself when the
speaker comes back.

A speaker that is no longer paired has its entity **removed completely**: BlueZ
withdraws the device object of anything it treats as temporary - which is every
device that is not paired - and the add-on reports that as `detached: true`. The
entity is built from scratch if you pair the speaker again. Removing the speaker
in the add-on, or losing its trust, removes the entity the same way.

An add-on that predates these fields (no `paired`/`detached` in the record)
leaves the entity alone, so an older Bridge cannot make Home Assistant remove
entities it knows nothing about.

## Security

The Bridge does not map its native API onto the host LAN. Ingress remains the browser-facing path, while the integration communicates over Home Assistant's private add-on network.

## Add-on restarts and log noise

Updating, reconfiguring, or rebooting the Bridge add-on stops its container, which drops the event stream. The integration reconnects on its own (1s doubling to 30s) and reloads the speaker snapshot as soon as it is back.

That is expected, so an outage is reported **once**:

- a single `warning` when the stream is lost, naming the likely cause (add-on stopped, restarting, or updating);
- nothing further while it lasts — later retries are `debug`;
- one `info` line when it returns, with the number of attempts and how long it was unreachable.

If disconnects look more frequent than your add-on restarts, download the config-entry diagnostics: the `stream` block reports `outages` (one per lost stream), `failed_attempts` (the retries inside them), `reconnects`, `consecutive_failures`, `last_reason`, `last_disconnect_at`, `last_recovery_at`, and `last_outage_seconds`. Reasons are categories (`stream-closed`, `bridge-unreachable`, `stream-timeout`, `credential-rejected`), never raw connection errors. `credential-rejected` is the one case the integration stops retrying — reload the entry after the add-on has issued a new token.

## HACS Publishing

This repository is HACS-compatible as a custom integration repository. Listing it in HACS's default repository catalog is a separate HACS submission process; until then, users add the repository URL manually in HACS.