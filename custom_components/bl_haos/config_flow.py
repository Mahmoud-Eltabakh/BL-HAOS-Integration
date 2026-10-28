"""Config flow for the local BL-HAOS native bridge."""

from __future__ import annotations

from urllib.parse import urlsplit

import aiohttp
import voluptuous as vol
from homeassistant import config_entries
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .client import BLHAOSClient
from .compatibility import CompatibilityResult, evaluate_bridge_identity
from .const import (
    ADDON_HOSTNAME_SLUG,
    ADDON_SLUG,
    BEARER_PREFIX,
    BRIDGE_ID,
    BRIDGE_SERVICE_NAME,
    BRIDGE_UNIQUE_ID,
    CONF_ENDPOINT,
    CONF_LOG_LEVEL,
    CONF_TOKEN,
    CONFIG_ENTRY_VERSION,
    DEFAULT_ENDPOINT_EXAMPLE,
    DEFAULT_PORT,
    DOMAIN,
    ENDPOINT_SCHEME_NAMES,
    ENDPOINT_SCHEMES,
    ENTRY_TITLE,
    HEALTH_API_PATH,
    HTTP_SCHEME_PREFIX,
    IDENTITY_TIMEOUT_SECONDS,
    NATIVE_API_PATH,
    PAYLOAD_BRIDGE_ID_KEY,
    PAYLOAD_SERVICE_KEY,
    get_logger,
    normalize_log_level,
)
from http import HTTPStatus

from .call_trace import trace_call

_LOGGER = get_logger(__name__)


class BLHAOSOptionsFlow(config_entries.OptionsFlow):
    """Edit one paired speaker through the authenticated bridge client."""

    @trace_call
    def __init__(self, config_entry):
        self._entry = config_entry
        self._selected_address: str | None = None
        self._speaker_settings: dict = {}

    @trace_call
    async def async_step_init(self, user_input=None):
        client: BLHAOSClient = self._entry.runtime_data.client
        try:
            if user_input is not None:
                self._selected_address = user_input["address"]
                settings = await client.async_get_settings()
                self._speaker_settings = settings.get("speakers", {}).get(self._selected_address, {})
                return await self.async_step_speaker()
            devices = await client.async_list_devices()
        except (HomeAssistantError, KeyError, AttributeError):
            return self.async_show_form(step_id="init", data_schema=vol.Schema({}), errors={"base": "cannot_connect"})
        choices = {
            device["address"]: device.get("name") or device["address"]
            for device in devices
            if device.get("paired") or device.get("trusted")
        }
        if not choices:
            return self.async_show_form(step_id="init", data_schema=vol.Schema({}), errors={"base": "no_speakers"})
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({vol.Required("address"): vol.In(choices)}),
        )

    @trace_call
    async def async_step_speaker(self, user_input=None):
        client: BLHAOSClient = self._entry.runtime_data.client
        if user_input is not None:
            try:
                changes = dict(user_input)
                changes["custom_alias"] = changes.get("custom_alias", "")
                changes["preferred_adapter"] = changes.get("preferred_adapter") or None
                changes["codec_override"] = changes.get("codec_override") or None
                await client.async_update_speaker_settings(self._selected_address, **changes)
            except HomeAssistantError:
                return self.async_show_form(
                    step_id="speaker", data_schema=self._speaker_schema(), errors={"base": "cannot_connect"}
                )
            return self.async_create_entry(title="", data={})
        return self.async_show_form(step_id="speaker", data_schema=self._speaker_schema())

    @trace_call
    def _speaker_schema(self):
        settings = self._speaker_settings
        return vol.Schema({
            vol.Optional("custom_alias", default=settings.get("custom_alias") or ""): str,
            vol.Optional("auto_reconnect", default=settings.get("auto_reconnect", True)): bool,
            vol.Optional("preferred_adapter", default=settings.get("preferred_adapter") or ""): str,
            vol.Optional("default_volume", default=settings.get("default_volume", 50)): vol.All(int, vol.Range(min=0, max=100)),
            vol.Optional("codec_override", default=settings.get("codec_override") or ""): vol.In(["", "auto", "sbc", "sbc_xq", "aac", "aptx", "aptx_hd", "ldac"]),
        })


class BLHAOSConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Configure one local BL-HAOS native bridge."""

    VERSION = CONFIG_ENTRY_VERSION

    @staticmethod
    @trace_call
    def async_get_options_flow(config_entry):
        return BLHAOSOptionsFlow(config_entry)

    @staticmethod
    @trace_call
    def _validate_endpoint(endpoint: str) -> str | None:
        """Normalize a local HTTP(S) endpoint to scheme://host:port."""
        endpoint = str(endpoint or "").strip()
        if not endpoint:
            return None
        if not endpoint.startswith(ENDPOINT_SCHEMES):
            endpoint = f"{HTTP_SCHEME_PREFIX}{endpoint}"
        parsed = urlsplit(endpoint)
        if (
            parsed.scheme not in ENDPOINT_SCHEME_NAMES
            or not parsed.hostname
            or parsed.username
            or parsed.password
            or parsed.path not in ("", "/")
            or parsed.query
            or parsed.fragment
        ):
            return None
        hostname = parsed.hostname.lower()
        port = parsed.port or DEFAULT_PORT
        # IPv6 literals must stay bracketed in the reconstructed netloc.
        host_part = f"[{hostname}]" if ":" in hostname else hostname
        return f"{parsed.scheme}://{host_part}:{port}"

    @staticmethod
    @trace_call
    def _endpoint_from_hassio_slug(slug: str) -> str | None:
        """Derive the Supervisor-private add-on hostname from its slug."""
        if not (ADDON_SLUG in slug or slug.endswith(ADDON_HOSTNAME_SLUG)):
            return None
        return f"{HTTP_SCHEME_PREFIX}{slug.replace('_', '-')}:{DEFAULT_PORT}"

    @trace_call
    async def _async_bridge_identity(self, target: str) -> bool:
        """Whether the endpoint introduces itself as a BL-HAOS bridge.

        Checked *before* the bearer token is attached: the endpoint is derived from
        a discovery payload or from operator input, and an identity request that
        already carries the credential cannot protect it (see THREAT-MODEL.md, T4).
        """
        async with async_get_clientsession(self.hass).get(
            f"{target}{HEALTH_API_PATH}",
            timeout=aiohttp.ClientTimeout(total=IDENTITY_TIMEOUT_SECONDS),
        ) as response:
            payload = await response.json(content_type=None)
            return (
                response.status == HTTPStatus.OK
                and isinstance(payload, dict)
                and payload.get(PAYLOAD_SERVICE_KEY) == BRIDGE_SERVICE_NAME
            )

    @trace_call
    async def _async_validate_connection(self, endpoint: str, token: str) -> CompatibilityResult | None:
        """Validate identity and release compatibility before storing an entry."""
        for target in (endpoint, endpoint.replace("_", "-")):
            try:
                _LOGGER.debug("Validating bridge connection to endpoint: %s", target)
                if not await self._async_bridge_identity(target):
                    _LOGGER.debug(
                        "Endpoint %s did not identify as a BL-HAOS bridge; the token was not sent",
                        target,
                    )
                    continue
                async with async_get_clientsession(self.hass).get(
                    f"{target}{NATIVE_API_PATH}/identity",
                    headers={"Authorization": f"{BEARER_PREFIX}{token}"},
                    timeout=aiohttp.ClientTimeout(total=IDENTITY_TIMEOUT_SECONDS),
                ) as response:
                    payload = await response.json(content_type=None)
                    if (
                        response.status == HTTPStatus.OK
                        and isinstance(payload, dict)
                        and payload.get(PAYLOAD_BRIDGE_ID_KEY) == BRIDGE_ID
                    ):
                        result = await evaluate_bridge_identity(self.hass, payload)
                        _LOGGER.debug(
                            "Bridge compatibility at %s: status=%s reason=%s",
                            target,
                            result.status,
                            result.reason,
                        )
                        return result
                    _LOGGER.debug(
                        "Bridge identity validation failed at %s (HTTP %s)", target, response.status
                    )
            except (AttributeError, TypeError, ValueError, aiohttp.ClientError, TimeoutError) as err:
                _LOGGER.debug("Bridge validation attempt failed for %s: %s", target, err)
                continue
        return None

    @trace_call
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
            compatibility = None
            if endpoint is not None and token:
                for candidate in (endpoint, endpoint.replace("_", "-")):
                    compatibility = await self._async_validate_connection(candidate, token)
                    if compatibility is not None and compatibility.status == "incompatible":
                        break
                    if compatibility is not None:
                        _LOGGER.debug("Config flow user step creating entry for endpoint: %s", candidate)
                        return self.async_create_entry(
                            title=ENTRY_TITLE,
                            data={CONF_ENDPOINT: candidate, CONF_TOKEN: token},
                        )
            _LOGGER.debug("User configuration failed connection validation for %s", raw_endpoint)
            errors["base"] = (
                "incompatible_version"
                if compatibility is not None and compatibility.status == "incompatible"
                else "cannot_connect"
            )
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required(CONF_ENDPOINT, default=DEFAULT_ENDPOINT_EXAMPLE): str,
                vol.Required(CONF_TOKEN): str,
            }),
            errors=errors,
        )

    @trace_call
    async def async_step_hassio(self, discovery_info):
        """Discover a Bridge add-on through the Supervisor service registry."""
        endpoint = self._endpoint_from_hassio_slug(discovery_info.slug)
        _LOGGER.debug("Hass.io discovery received: slug=%s, derived endpoint=%s", discovery_info.slug, endpoint)
        if endpoint is None:
            return self.async_abort(reason="cannot_connect")
        await self.async_set_unique_id(BRIDGE_UNIQUE_ID)
        self._discovered_endpoint = endpoint
        self._discovered_token = str((discovery_info.config or {}).get("token", "")).strip()
        self._discovered_log_level = normalize_log_level((discovery_info.config or {}).get(CONF_LOG_LEVEL))
        self.context["title_placeholders"] = {"name": discovery_info.name}
        compatibility = (
            await self._async_validate_connection(endpoint, self._discovered_token)
            if self._discovered_token
            else None
        )
        if compatibility is not None and compatibility.status == "incompatible":
            return self.async_abort(reason="incompatible_version")
        connection_valid = compatibility is not None
        _LOGGER.debug("Hass.io discovery validation result: connection_valid=%s", connection_valid)
        updates = {CONF_ENDPOINT: endpoint, CONF_LOG_LEVEL: self._discovered_log_level}
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
                title=ENTRY_TITLE,
                data={
                    CONF_ENDPOINT: endpoint,
                    CONF_TOKEN: self._discovered_token,
                    CONF_LOG_LEVEL: self._discovered_log_level,
                },
            )
        return await self.async_step_hassio_confirm()

    @trace_call
    async def async_step_hassio_confirm(self, user_input=None):
        """Create the discovered add-on entry after one user confirmation."""
        if user_input is None:
            return self.async_show_form(
                step_id="hassio_confirm",
                data_schema=vol.Schema({vol.Required(CONF_TOKEN): str}),
            )
        _LOGGER.debug("Validating user-supplied token for Hass.io endpoint: %s", self._discovered_endpoint)
        compatibility = await self._async_validate_connection(self._discovered_endpoint, user_input[CONF_TOKEN])
        if compatibility is None:
            _LOGGER.debug("Hass.io confirm validation failed for endpoint %s", self._discovered_endpoint)
            return self.async_abort(reason="cannot_connect")
        if compatibility.status == "incompatible":
            return self.async_abort(reason="incompatible_version")
        _LOGGER.debug("Hass.io confirm succeeded, creating config entry for %s", self._discovered_endpoint)
        return self.async_create_entry(
            title=ENTRY_TITLE,
            data={
                CONF_ENDPOINT: self._discovered_endpoint,
                CONF_TOKEN: user_input[CONF_TOKEN],
                CONF_LOG_LEVEL: self._discovered_log_level,
            },
        )
