"""Config flow for the local BL-HAOS native bridge."""

from __future__ import annotations

import ipaddress
from urllib.parse import urlsplit

import aiohttp
import voluptuous as vol
from homeassistant import config_entries
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import BRIDGE_ID, BRIDGE_UNIQUE_ID, CONF_BRIDGE_TOKEN, CONF_ENDPOINT, DOMAIN, NATIVE_API_PATH


class BLHAOSConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Configure one local BL-HAOS native bridge."""

    VERSION = 1

    @staticmethod
    def _validate_endpoint(endpoint: str) -> str | None:
        """Allow only a plain HTTP endpoint on the local network."""
        parsed = urlsplit(endpoint)
        if (
            parsed.scheme != "http"
            or not parsed.hostname
            or parsed.username
            or parsed.password
            or parsed.path not in ("", "/")
            or parsed.query
            or parsed.fragment
        ):
            return None
        hostname = parsed.hostname.lower()
        if hostname in {"homeassistant", "localhost"}:
            return endpoint.rstrip("/")
        try:
            address = ipaddress.ip_address(hostname)
        except ValueError:
            return None
        if not address.is_private or address.is_link_local:
            return None
        return endpoint.rstrip("/")

    async def _async_validate_connection(self, endpoint: str, bridge_token: str) -> bool:
        """Validate the authenticated native bridge identity before storing an entry."""
        try:
            async with async_get_clientsession(self.hass).get(
                f"{endpoint}{NATIVE_API_PATH}/identity",
                headers={"Authorization": f"Bearer {bridge_token}"},
                timeout=aiohttp.ClientTimeout(total=10),
            ) as response:
                payload = await response.json()
                return response.status == 200 and payload.get("bridge_id") == BRIDGE_ID
        except (aiohttp.ClientError, TimeoutError, ValueError):
            return False

    async def async_step_user(self, user_input=None):
        """Validate endpoint and token, then create the one native bridge entry."""
        await self.async_set_unique_id(BRIDGE_UNIQUE_ID)
        self._abort_if_unique_id_configured()
        errors = {}
        if user_input is not None:
            endpoint = self._validate_endpoint(user_input[CONF_ENDPOINT])
            bridge_token = user_input[CONF_BRIDGE_TOKEN].strip()
            if not bridge_token or endpoint is None or not await self._async_validate_connection(endpoint, bridge_token):
                errors["base"] = "cannot_connect"
            else:
                return self.async_create_entry(
                    title="BL-HAOS Bluetooth Audio",
                    data={CONF_ENDPOINT: endpoint, CONF_BRIDGE_TOKEN: bridge_token},
                )
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({vol.Required(CONF_ENDPOINT): str, vol.Required(CONF_BRIDGE_TOKEN): str}),
            errors=errors,
        )