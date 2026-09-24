"""Config flow for the local BL-HAOS native bridge."""

from __future__ import annotations

import logging
from urllib.parse import urlsplit

import aiohttp
import voluptuous as vol
from homeassistant import config_entries
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import BRIDGE_ID, BRIDGE_UNIQUE_ID, CONF_ENDPOINT, CONF_TOKEN, DOMAIN, NATIVE_API_PATH

_LOGGER = logging.getLogger(__name__)


class BLHAOSConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Configure one local BL-HAOS native bridge."""

    VERSION = 1

    @staticmethod
    def _validate_endpoint(endpoint: str) -> str | None:
        """Allow only a plain HTTP endpoint on the local network."""
        endpoint = str(endpoint or "").strip()
        if not endpoint:
            return None
        if not endpoint.startswith("http://") and not endpoint.startswith("https://"):
            endpoint = f"http://{endpoint}"
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
        port = parsed.port or 8099
        netloc = f"{hostname}:{port}"
        return f"http://{netloc}"

    @staticmethod
    def _endpoint_from_hassio_slug(slug: str) -> str | None:
        """Derive the Supervisor-private add-on hostname from its slug."""
        if not ("bl_haos" in slug or slug.endswith("bl-haos")):
            return None
        return f"http://{slug.replace('_', '-')}:8099"

    async def _async_validate_connection(self, endpoint: str, token: str) -> bool:
        """Validate the native bridge identity before storing an entry."""
        for target in (endpoint, endpoint.replace("_", "-")):
            try:
                _LOGGER.debug("Validating bridge connection to endpoint: %s", target)
                async with async_get_clientsession(self.hass).get(
                    f"{target}{NATIVE_API_PATH}/identity",
                    headers={"Authorization": f"Bearer {token}"},
                    timeout=aiohttp.ClientTimeout(total=5),
                ) as response:
                    payload = await response.json()
                    if response.status == 200 and payload.get("bridge_id") == BRIDGE_ID:
                        _LOGGER.debug(
                            "Bridge identity verified at %s (bridge_id=%s, version=%s)",
                            target,
                            payload.get("bridge_id"),
                            payload.get("version"),
                        )
                        return True
                    _LOGGER.debug(
                        "Bridge connection to %s returned unexpected response (status=%s, payload=%s)",
                        target,
                        response.status,
                        payload,
                    )
            except (aiohttp.ClientError, TimeoutError, ValueError) as err:
                _LOGGER.debug("Bridge validation attempt failed for %s: %s", target, err)
                continue
        return False

    async def async_step_user(self, user_input=None):
        """Offer an endpoint fallback when Supervisor discovery is unavailable."""
        await self.async_set_unique_id(BRIDGE_UNIQUE_ID)
        self._abort_if_unique_id_configured()
        errors = {}
        if user_input is not None:
            raw_endpoint = user_input.get(CONF_ENDPOINT, "")
            token = str(user_input.get(CONF_TOKEN, "")).strip()
            endpoint = self._validate_endpoint(raw_endpoint)
            _LOGGER.debug("User submitted endpoint '%s' (normalized: '%s')", raw_endpoint, endpoint)
            if endpoint is not None and token:
                for candidate in (endpoint, endpoint.replace("_", "-")):
                    if await self._async_validate_connection(candidate, token):
                        _LOGGER.debug("Config flow user step creating entry for endpoint: %s", candidate)
                        return self.async_create_entry(
                            title="BL-HAOS Bluetooth Audio",
                            data={CONF_ENDPOINT: candidate, CONF_TOKEN: token},
                        )
            _LOGGER.debug("User configuration failed connection validation for %s", raw_endpoint)
            errors["base"] = "cannot_connect"
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required(CONF_ENDPOINT, default="http://c839f4a9-bl-haos:8099"): str,
                vol.Required(CONF_TOKEN): str,
            }),
            errors=errors,
        )

    async def async_step_hassio(self, discovery_info):
        """Discover a Bridge add-on through the Supervisor service registry."""
        endpoint = self._endpoint_from_hassio_slug(discovery_info.slug)
        _LOGGER.debug("Hass.io discovery received: slug=%s, derived endpoint=%s", discovery_info.slug, endpoint)
        if endpoint is None:
            return self.async_abort(reason="cannot_connect")
        await self.async_set_unique_id(BRIDGE_UNIQUE_ID)
        self._discovered_endpoint = endpoint
        self._discovered_token = str((discovery_info.config or {}).get("token", "")).strip()
        self.context["title_placeholders"] = {"name": discovery_info.name}
        connection_valid = bool(self._discovered_token) and await self._async_validate_connection(
            endpoint, self._discovered_token
        )
        _LOGGER.debug("Hass.io discovery validation result: connection_valid=%s", connection_valid)
        updates = {CONF_ENDPOINT: endpoint}
        if connection_valid:
            updates[CONF_TOKEN] = self._discovered_token
        existing_entry = next(
            (entry for entry in self.hass.config_entries.async_entries(DOMAIN)
             if entry.unique_id == BRIDGE_UNIQUE_ID),
            None,
        )
        if existing_entry and connection_valid:
            new_data = {**existing_entry.data, **updates}
            if new_data != existing_entry.data:
                _LOGGER.debug("Updating existing BL-HAOS entry %s with new data", existing_entry.entry_id)
                self.hass.config_entries.async_update_entry(existing_entry, data=new_data)
                await self.hass.config_entries.async_reload(existing_entry.entry_id)
            return self.async_abort(reason="already_configured")
        self._abort_if_unique_id_configured(updates=updates)
        if connection_valid:
            _LOGGER.debug("Creating entry from validated Hass.io discovery: %s", endpoint)
            return self.async_create_entry(
                title="BL-HAOS Bluetooth Audio",
                data={CONF_ENDPOINT: endpoint, CONF_TOKEN: self._discovered_token},
            )
        return await self.async_step_hassio_confirm()

    async def async_step_hassio_confirm(self, user_input=None):
        """Create the discovered add-on entry after one user confirmation."""
        if user_input is None:
            return self.async_show_form(
                step_id="hassio_confirm",
                data_schema=vol.Schema({vol.Required(CONF_TOKEN): str}),
            )
        _LOGGER.debug("Validating user-supplied token for Hass.io endpoint: %s", self._discovered_endpoint)
        if not await self._async_validate_connection(self._discovered_endpoint, user_input[CONF_TOKEN]):
            _LOGGER.debug("Hass.io confirm validation failed for endpoint %s", self._discovered_endpoint)
            return self.async_abort(reason="cannot_connect")
        _LOGGER.debug("Hass.io confirm succeeded, creating config entry for %s", self._discovered_endpoint)
        return self.async_create_entry(
            title="BL-HAOS Bluetooth Audio",
            data={CONF_ENDPOINT: self._discovered_endpoint, CONF_TOKEN: user_input[CONF_TOKEN]},
        )