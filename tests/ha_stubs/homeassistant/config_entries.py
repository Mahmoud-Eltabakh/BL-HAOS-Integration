"""Minimal homeassistant.config_entries stand-in."""


class ConfigEntry:
    """Type-only placeholder; client.py only uses it as an annotation."""


class ConfigFlow:
    """Enough of the real base class to import a platform config flow.

    Home Assistant's real ``ConfigFlow`` consumes ``domain=`` in its metaclass;
    accepting it here lets unit tests import ``config_flow.py`` — and therefore
    execute its pure helpers — without the Home Assistant runtime.
    """

    def __init_subclass__(cls, domain: str | None = None, **kwargs) -> None:
        super().__init_subclass__(**kwargs)
        cls.domain = domain
