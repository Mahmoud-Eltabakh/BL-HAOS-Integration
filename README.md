# BL-HAOS Home Assistant Integration

This HACS custom integration exposes trusted BL-HAOS Bluetooth speakers as native Home Assistant `media_player` entities. It uses the Bridge add-on's private Supervisor-network REST snapshot and WebSocket event stream; it does not use MQTT or a user-managed key.

Each speaker entity supports Home Assistant's media browser (`BROWSE_MEDIA`), so you can browse local media folders and other configured media sources directly from the Home Assistant UI instead of only playing media by URL.

## Install

1. In HACS, add `https://github.com/Mahmoud-Eltabakh/BL-HAOS-Integration` as a custom **Integration** repository and install **BL-HAOS Bluetooth Audio**.
2. Restart Home Assistant.
3. Home Assistant discovers the Bridge add-on. Confirm the **BL-HAOS Bluetooth Audio** setup prompt.

The integration derives the add-on's private hostname from Supervisor discovery, validates `GET /api/native/identity`, then reads `GET /api/native/speakers` and listens on `/ws/native` for updates. The Bridge add-on pushes its native token through the same Supervisor discovery message, so the config flow completes automatically with no manual token entry when discovery succeeds. Existing entries also refresh this credential when the add-on rotates it after a reinstall or data reset. A manual local endpoint and token entry are available only as a fallback.

## Security

The Bridge does not map its native API onto the host LAN. Ingress remains the browser-facing path, while the integration communicates over Home Assistant's private add-on network.

## HACS Publishing

This repository is HACS-compatible as a custom integration repository. Listing it in HACS's default repository catalog is a separate HACS submission process; until then, users add the repository URL manually in HACS.