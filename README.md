# BL-HAOS Home Assistant Integration

This HACS custom integration exposes trusted BL-HAOS Bluetooth speakers as native Home Assistant `media_player` entities. It uses the Bridge add-on's private Supervisor-network REST snapshot and WebSocket event stream; it does not use MQTT or a user-managed key.

Each speaker entity supports Home Assistant's media browser (`BROWSE_MEDIA`), so you can browse local media folders and other configured media sources directly from the Home Assistant UI instead of only playing media by URL.

Native Browse Media retains audio items and provider playlists using Home
Assistant's media metadata, not provider names or identifier shapes. Expandable
folders remain traversable, including unknown providers; unsupported playable
leaves are excluded without flattening the hierarchy or changing supplied
titles, artwork, identifiers, or play/expand/search capabilities. Provider
shortcuts remain one atomic queue item; their internal tracks are not expanded.
Home Assistant resolves every saved reference in order before submitting one
queue start to the selected connected speaker. Resolution and queue failures
produce bounded errors without URL/credential details, fallback, or target
substitution. Queue start, Next, and Previous are not automatically retried.

## Media Catalog Panel

### Phase 24 Local Workflow and Limits

The production panel and integrated bridge 0.2.69 remain undeployed; local
Core 2026.10.3 tests are not live-provider, expiry or physical-playback proof.
After separately authorized installation, use **Native Browse Media** on the
speaker or **Open Media Catalog** in the Home Assistant-native media panel. In **Play on**, select exactly one connected BL-HAOS speaker, browse
the provider hierarchy and press **Play** for an audio item or provider playlist.
The original opaque reference goes unchanged to native `media_player.play_media`;
HA owns provider authentication and reference resolution. A playlist stays one
reference, not a local queue. Only explicit same-item/same-target retry is
offered after failure, never automatic retry, fallback, skip or target substitution.
Search appears only when HA advertises it.

The panel does not store browser/add-on HA/provider credentials, proxy a bridge
catalog, contact providers directly, or accept raw URL input. Existing native
direct-URL support is separate, not a catalog fallback. Public provider layout
and actual expiry remain unverified.

### Phase 25 Local Candidate

The local Phase 25 candidate uses the authenticated panel and Home Assistant-owned
storage for custom playlists of ordered Home Assistant media references and
one-reference provider-playlist shortcuts; provider tracks are not copied.
Availability checks are explicit HA media-source browse requests for the exact
saved reference only; they do not resolve or play media and never rewrite saved
IDs.

### Phase 26 Local Queue Candidate

The local Phase 26 candidate resolves every saved reference in Home Assistant
before one queue start. The bridge owns one in-memory queue per speaker; the
Library panel and native entity consume the bridge's authoritative snapshot. Native queue controls require bridge queue version 1.
Resolved playback URLs are transient between Home Assistant and the bridge and
are never sent to the browser or stored in the playlist library. Failed items
remain current until an explicit Play retry or Next skip; the integration does
not automatically retry queue start, Next, or Previous. Queues do not resume
after an add-on restart.

Local SIL and mock evidence do not establish live provider or audible playback
acceptance. Phase 24 production requirements remain pending, T-24-15 remains
OPEN/HIGH, and T-24-16 remains OPEN/MEDIUM. Release and deployment are not
approved. Follow root TESTING.md for separately authorized HAOS acceptance.

Successful integration setup registers **BL-HAOS Media** at `/bl-haos-media`.
The packaged `panel_static/bl-haos-media-panel.js` module is served at
`/api/bl_haos/catalog/bl-haos-media-panel.js`. Select one connected speaker in
**Play on** before playing a media-source item. The panel uses only Home
Assistant's injected `hass` browse and service APIs; provider authentication and
media resolution remain in Home Assistant. It does not copy tokens, persist
browser credentials, or contact the Bridge catalog or providers directly.

Config entries share serialized ownership of one panel and one temporary served
copy of the packaged module. Unloading one entry keeps the panel available to
other entries. Final unload or failed first-owner setup removes the panel through
the public frontend API and deletes the temporary copy, making the module URL
return HTTP 404. Core 2026.10.3 has no public static-path unregister API: its inert
route remains until Core exits, and later setup recreates the same file and
reuses that route. This is serving disablement, not full route unregistration.
An indeterminate static-registration failure stays fail-closed for the current
Core lifetime rather than attempting duplicate registration; setup then reports
that a Core restart is required. No restart is performed automatically.

The separate `panel_ui` source package builds the native Home Assistant panel using `npm ci`
and `npm run build` from that directory. Its lockfile and exact dependency pins
are independent of the headless add-on. The local catalog is covered by Core
2026.10.3 SIL and injected-hass browser tests; production provider playback and
HA-shell acceptance still require the phase 24 target-host checks.

## Install

1. In HACS, add `https://github.com/Mahmoud-Eltabakh/BL-HAOS-Integration` as a custom **Integration** repository and install **BL-HAOS Bluetooth Audio**.
2. Restart Home Assistant.
3. Home Assistant discovers the Bridge add-on. Confirm the **BL-HAOS Bluetooth Audio** setup prompt.

The integration derives the add-on's private hostname from Supervisor discovery, validates `GET /api/native/identity`, then reads `GET /api/native/speakers` and listens on `/ws/native` for updates. The Bridge add-on pushes its native token and configured `log_level` through the same Supervisor discovery message, so discovered integration logging stays synchronized with the add-on without changing Home Assistant's global logger. Existing entries refresh these values and reload themselves when the add-on rotates its token or changes log level. A manual local endpoint and token entry are available only as a fallback; manually configured entries default to `info`.


## Headless bridge migration and compatibility

Bridge 0.2.71 and integration 0.2.22 are local, undeployed candidates. The old
add-on Ingress application and legacy management routes are retired; the native
Home Assistant media and Speakers panels remain. Pairing, speaker settings, and
adapter actions are available from the **Speakers** view, admin-only `bl_haos.*`
services, and speaker options flow. The add-on health/watchdog/discovery endpoints
remain internal on port 8099 without host-port mapping; `/ws` remains operational
transport, not an alternative UI.

The integration requires add-on 0.2.70 or newer; add-on 0.2.69 and integration 0.2.21 are known too old for this candidate. Bridge identity advertises
`addon_version` and `min_integration_version`; these product versions do not change
integer native protocol `version: 1`. The supported local pair is bridge 0.2.71
with integration 0.2.22. Lower versions than a declared minimum, partial or malformed
metadata, prereleases, and unsupported protocol versions produce an HA Repair
error shown in Home Assistant Repairs. If both product metadata fields are absent on protocol 1, Home Assistant Repairs shows an
`unknown_legacy` warning while allowing existing behavior. An older integration
cannot enforce minimum versions advertised by a newer bridge. Update the integration
first, confirm native controls with the existing bridge (legacy warning may be
expected), then update the bridge and verify identity/repair clearance. Back up
configuration and data first; preserve existing tokens, speaker pairings, aliases,
and settings. For rollback, restore a previously working package pair and backup
under separate maintenance authority. Do not delete speakers, wipe the config
entry, or rotate credentials to fix a compatibility mismatch. In-memory playback
queues still do not resume after an add-on restart. Old Ingress links may stop
resolving; a root notice cannot restore Supervisor Ingress access. A grace release
with a reachable UI requires separate approval. Phase 39 remains the authority
boundary for installation, publication, deployment, and live acceptance.

## Pairing, Speaker Management, and Settings

The integration's **Speakers** panel view provides discovery scanning, pairing
(with an optional PIN), connect/disconnect, removal, renaming, per-speaker
settings, and Bluetooth adapter power controls. The integration options flow
also lets an administrator choose a paired speaker and edit its alias,
auto-reconnect preference, preferred adapter, default volume, and codec override.

The `bl_haos` domain exposes admin-only services:

| Service | Fields |
|---|---|
| `scan_start`, `scan_stop` | Optional `adapter_name` |
| `pair` | Required `address`; optional `pin` |
| `connect`, `disconnect`, `remove` | Required `address` |
| `rename` | Required `address`, `custom_alias` (empty string clears the alias) |
| `update_speaker_settings` | Required `address`; optional `custom_alias`, `auto_reconnect`, `preferred_adapter`, `default_volume` (0–100), `codec_override` |
| `update_system_settings` | Optional `log_level`, `default_codec`, `auto_reconnect_enabled` |
| `set_adapter_power` | Required `adapter_name`, `powered` |

When more than one BL-HAOS config entry is present, pass `config_entry_id` to
select the target. For example, `bl_haos.pair` accepts `address: "AA:BB:CC:DD:EE:FF"`
and `pin: "1234"`; `bl_haos.update_system_settings` accepts
`default_codec: "ldac"` or `auto_reconnect_enabled: false`.

System setting edits update the bridge-managed `ConfigStore` fields through its
authenticated native API. They do not call the Supervisor add-on options API or
handle a Supervisor token. `native_token`, demo configuration, and player tuning
are not exposed by the management view. These local changes are not live-host
acceptance or deployment evidence.

## Speakers that are switched off, and speakers that are gone

A trusted speaker that is switched off (or out of range) keeps its identity but
is **disabled**: the add-on keeps publishing it with `connected: false` and
`paired: true`, the entity leaves the state machine (no dead card, and no
automation target that silently fails) while its name, history and Home Assistant
entity identity are kept, and the same entity is enabled again by itself when the
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

The Bridge does not map its native API onto the host LAN. The native integration communicates with it over Home Assistant's private add-on network; the retired add-on Ingress UI is not a browser-facing path.

## Add-on restarts and log noise

Updating, reconfiguring, or rebooting the Bridge add-on stops its container, which drops the event stream. The integration reconnects on its own (1s doubling to 30s) and reloads the speaker snapshot as soon as it is back.

That is expected, so an outage is reported **once**:

- a single `warning` when the stream is lost, naming the likely cause (add-on stopped, restarting, or updating);
- nothing further while it lasts — later retries are `debug`;
- one `info` line when it returns, with the number of attempts and how long it was unreachable.

If disconnects look more frequent than your add-on restarts, download the config-entry diagnostics: the `stream` block reports `outages` (one per lost stream), `failed_attempts` (the retries inside them), `reconnects`, `consecutive_failures`, `last_reason`, `last_disconnect_at`, `last_recovery_at`, and `last_outage_seconds`. Reasons are categories (`stream-closed`, `bridge-unreachable`, `stream-timeout`, `credential-rejected`), never raw connection errors. `credential-rejected` is the one case the integration stops retrying — reload the entry after the add-on has issued a new token.

### Detailed call tracing

From integration 0.2.19, DEBUG logging traces named integration functions,
including setup, discovery/configuration, native HTTP/WebSocket calls, speaker
policy, diagnostics, entity properties, and media-player commands. Logger
construction and message formatting are excluded to avoid recursive logging.
Enable the discovered add-on's `log_level: debug` (its `trace` option also maps
to DEBUG), or temporarily set the `custom_components.bl_haos` logger to `debug`
for a manually configured entry.

`[BL-HAOS] call enter` records the function, a `span` identifier, and its
`parent` span. `call exit`, `call error`, and `call cancel` record elapsed
milliseconds; errors name their exception type without exposing its message
or traceback. Arguments and return values are never included in call traces.
Spans are local to one runtime, not a cross-process request ID, and third-party
library internals are not traced. Async execution is traced when awaited,
and long-running listeners complete their span only when they stop.

Export Home Assistant Core logs alongside the add-on logs to correlate command
times with BlueZ/audio behavior. Restore `info` after reproducing the issue:
DEBUG traces can be large and add overhead. Existing operational messages
still contain device identifiers, so review logs before sharing. Playback
submission logs omit the resolved URL, command options, and raw transport
failure detail; they retain operation, entity, and normalized media type.
The validated URL remains an internal command value required for decoding,
not diagnostic output. This is not a global sanitizer for third-party logs.

## HACS Publishing

This repository is HACS-compatible as a custom integration repository. Listing it in HACS's default repository catalog is a separate HACS submission process; until then, users add the repository URL manually in HACS.