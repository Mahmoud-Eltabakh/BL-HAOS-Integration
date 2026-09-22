# BL-HAOS Home Assistant Integration

This HACS custom integration exposes trusted BL-HAOS Bluetooth speakers as native Home Assistant `media_player` entities. It uses the add-on's authenticated local REST snapshot and WebSocket event stream; it does not use MQTT.

## Install

1. In HACS, add `https://github.com/Mahmoud-Eltabakh/BL-HAOS-Integration` as a custom **Integration** repository and install **BL-HAOS Bluetooth Audio**.
2. Restart Home Assistant.
3. In the BL-HAOS add-on configuration, generate a long random bridge token and save it in `bridge_token`.
4. In **Settings > Devices & services**, add **BL-HAOS Bluetooth Audio**. Enter the add-on's local HTTP endpoint and the same bridge token.

The integration accepts only `http://` local endpoints: `homeassistant`, `localhost`, or a private non-link-local IP address. It authenticates `GET /api/native/identity` before saving the configuration, then reads `GET /api/native/speakers` and listens on `/ws/native` for updates.

## Security

Treat `bridge_token` as a secret. It is stored by Home Assistant as config-entry data and is sent only as an authorization header to the configured local endpoint. The component never logs the token, endpoint, media URL, or authorization header. Rotate the token in both the add-on and integration configuration when it is exposed.

## HACS Publishing

This repository is HACS-compatible as a custom integration repository. Listing it in HACS's default repository catalog is a separate HACS submission process; until then, users add the repository URL manually in HACS.