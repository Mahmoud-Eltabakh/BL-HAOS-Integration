"""Config flow for the local BL-HAOS native bridge."""

from __future__ import annotations

import ipaddress
from urllib.parse import urlsplit

import aiohttp
import voluptuous as vol
from homeassistant import config_entries
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import BRIDGE_ID, BRIDGE_UNIQUE_ID, CONF_ENDPOINT, DOMAIN, NATIVE_API_PATH


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

    @staticmethod
    def _endpoint_from_hassio_slug(slug: str) -> str | None:
        """Derive the Supervisor-private add-on hostname from its slug."""
        if not slug.endswith("_bl_haos"):
            return None
        return f"http://{slug.replace('_', '-')}:8099"

    async def _async_validate_connection(self, endpoint: str) -> bool:
        """Validate the native bridge identity before storing an entry."""
        try:
            async with async_get_clientsession(self.hass).get(
                f"{endpoint}{NATIVE_API_PATH}/identity",
                timeout=aiohttp.ClientTimeout(total=10),
            ) as response:
                payload = await response.json()
                return response.status == 200 and payload.get("bridge_id") == BRIDGE_ID
        except (aiohttp.ClientError, TimeoutError, ValueError):
            return False

    async def async_step_user(self, user_input=None):
        """Offer an endpoint fallback when Supervisor discovery is unavailable."""
        await self.async_set_unique_id(BRIDGE_UNIQUE_ID)
        self._abort_if_unique_id_configured()
        errors = {}
        if user_input is not None:
            endpoint = self._validate_endpoint(user_input[CONF_ENDPOINT])
            if endpoint is None or not await self._async_validate_connection(endpoint):
                errors["base"] = "cannot_connect"
            else:
                return self.async_create_entry(
                    title="BL-HAOS Bluetooth Audio",
                    data={CONF_ENDPOINT: endpoint},
                )
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({vol.Required(CONF_ENDPOINT): str}),
            errors=errors,
        )

    async def async_step_hassio(self, discovery_info):
        """Discover a Bridge add-on through the Supervisor service registry."""
        endpoint = self._endpoint_from_hassio_slug(discovery_info.slug)
        if endpoint is None or not await self._async_validate_connection(endpoint):
            return self.async_abort(reason="cannot_connect")
        await self.async_set_unique_id(BRIDGE_UNIQUE_ID)
        self._abort_if_unique_id_configured(updates={CONF_ENDPOINT: endpoint})
        self._discovered_endpoint = endpoint
        self.context["title_placeholders"] = {"name": discovery_info.name}
        return self.async_show_form(step_id="hassio_confirm", data_schema=vol.Schema({}))

    async def async_step_hassio_confirm(self, user_input=None):
        """Create the discovered add-on entry after one user confirmation."""
        if user_input is None:
            return self.async_show_form(step_id="hassio_confirm", data_schema=vol.Schema({}))
        return self.async_create_entry(
            title="BL-HAOS Bluetooth Audio", data={CONF_ENDPOINT: self._discovered_endpoint}
        )