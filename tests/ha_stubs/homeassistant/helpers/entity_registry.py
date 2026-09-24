"""Minimal homeassistant.helpers.entity_registry stand-in."""


class _RegistryEntry:
    def __init__(self, entity_id: str, unique_id: str, platform: str) -> None:
        self.entity_id = entity_id
        self.unique_id = unique_id
        self.platform = platform


class _Registry:
    def __init__(self) -> None:
        self.entities: dict[str, _RegistryEntry] = {}

    def async_get(self, entity_id):
        return self.entities.get(entity_id)


def async_get(hass):
    return hass.data.setdefault("entity_registry", _Registry())


def async_entries_for_config_entry(registry, entry_id):
    return list(registry.entities.values())
