"""HA-owned persistent storage for BL-HAOS playlists."""

from __future__ import annotations

import asyncio
import json
import re
from copy import deepcopy
from pathlib import Path
from typing import Any
from urllib.parse import unquote_plus
from uuid import UUID, uuid4

import probatio
import voluptuous as vol

from .const import DOMAIN, MEDIA_PLAYER_DOMAIN

from .call_trace import trace_call


LIBRARY_DATA = f"{DOMAIN}_playlist_library"
LIBRARY_STORE_VERSION = 1
LIBRARY_STORE_KEY = f"{DOMAIN}.playlist_library"
LIBRARY_SCHEMA_VERSION = 2
MAX_RECORDS = 100
MAX_CUSTOM_ENTRIES = 250
MAX_LIBRARY_BYTES = 2 * 1024 * 1024
MAX_NAME_BYTES = 128
MAX_MEDIA_ID_BYTES = 2048
MAX_TITLE_BYTES = 256
MAX_MEDIA_CLASS_BYTES = 128
MAX_CONTENT_TYPE_BYTES = 128
_MEDIA_SOURCE_ID = re.compile(r"^media-source://", re.IGNORECASE)
_RAW_PLAYBACK_URL = re.compile(r"^https?://", re.IGNORECASE)
_CREDENTIAL_QUERY_KEYS = frozenset(
    {
        "access_token",
        "api_key",
        "apikey",
        "auth",
        "authorization",
        "client_secret",
        "credential",
        "credentials",
        "key",
        "password",
        "passwd",
        "refresh_token",
        "secret",
        "session",
        "session_id",
        "sig",
        "signature",
        "token",
    }
)
_ENTRY_FIELDS = frozenset(
    {"media_content_id", "title", "media_class", "media_content_type"}
)
_RECORD_BASE_FIELDS = frozenset({"record_id", "record_revision", "kind", "name"})
_LEGACY_RECORD_FIELDS = frozenset({"record_id", "kind", "name", "entries"})
_CUSTOM_RECORD_FIELDS = _RECORD_BASE_FIELDS | {"entries"}
_PROVIDER_REQUIRED_FIELDS = _RECORD_BASE_FIELDS | {"media_content_id"}
_PROVIDER_OPTIONAL_FIELDS = frozenset({"title", "media_class", "media_content_type"})
_EMPTY_LIBRARY: dict[str, Any] = {
    "schema_version": LIBRARY_SCHEMA_VERSION,
    "revision": 0,
    "records": [],
}


class PlaylistLibraryError(Exception):
    """Base error for bounded playlist-library command failures."""


class PlaylistLibraryValidationError(PlaylistLibraryError):
    """The playlist-library mutation is invalid."""


class PlaylistLibraryConflictError(PlaylistLibraryError):
    """The client attempted to overwrite a newer record revision."""


class PlaylistLibraryNotFoundError(PlaylistLibraryError):
    """The requested record does not exist in the requested record class."""


class PlaylistLibraryStorageError(PlaylistLibraryError):
    """The HA-owned playlist library could not be safely read or saved."""


@trace_call
def _utf8_size(value: str) -> int:
    try:
        return len(value.encode("utf-8"))
    except UnicodeEncodeError:
        return MAX_LIBRARY_BYTES + 1


@trace_call
def _valid_uuid(value: Any) -> bool:
    if not isinstance(value, str):
        return False
    try:
        return str(UUID(value)) == value
    except (AttributeError, TypeError, ValueError):
        return False


@trace_call
def validate_media_reference(media_content_id: Any) -> bool:
    """Validate the complete opaque HA reference without normalizing it."""
    if (
        not isinstance(media_content_id, str)
        or _utf8_size(media_content_id) > MAX_MEDIA_ID_BYTES
        or _RAW_PLAYBACK_URL.match(media_content_id)
        or not _MEDIA_SOURCE_ID.match(media_content_id)
    ):
        return False

    query = media_content_id.partition("?")[2]
    for pair in query.split("&") if query else ():
        key = pair.partition("=")[0]
        for _ in range(3):
            key = unquote_plus(key)
            if key.casefold() in _CREDENTIAL_QUERY_KEYS:
                return False
    return True


@trace_call
def _valid_display_value(value: Any, maximum_bytes: int, *, required: bool = False) -> bool:
    return (
        isinstance(value, str)
        and (not required or bool(value.strip()))
        and _utf8_size(value) <= maximum_bytes
        and not any(ord(character) < 32 for character in value)
    )


@trace_call
def _valid_entry(entry: Any) -> bool:
    if not isinstance(entry, dict) or not set(entry) <= _ENTRY_FIELDS:
        return False
    if "media_content_id" not in entry or not validate_media_reference(entry["media_content_id"]):
        return False
    return all(
        _valid_display_value(entry[field], maximum)
        for field, maximum in (
            ("title", MAX_TITLE_BYTES),
            ("media_class", MAX_MEDIA_CLASS_BYTES),
            ("media_content_type", MAX_CONTENT_TYPE_BYTES),
        )
        if field in entry
    )


@trace_call
def _valid_record(record: Any, revision: int) -> bool:
    if not isinstance(record, dict):
        return False
    fields = set(record)
    if record.get("kind") == "custom":
        valid_shape = fields == _CUSTOM_RECORD_FIELDS
    elif record.get("kind") == "provider":
        valid_shape = (
            _PROVIDER_REQUIRED_FIELDS <= fields
            and fields <= _PROVIDER_REQUIRED_FIELDS | _PROVIDER_OPTIONAL_FIELDS
        )
    else:
        return False
    if not (
        valid_shape
        and _valid_uuid(record["record_id"])
        and _valid_display_value(record["name"], MAX_NAME_BYTES, required=True)
        and isinstance(record["record_revision"], int)
        and not isinstance(record["record_revision"], bool)
        and 0 <= record["record_revision"] <= revision
    ):
        return False
    if record["kind"] == "custom":
        return (
            isinstance(record["entries"], list)
            and len(record["entries"]) <= MAX_CUSTOM_ENTRIES
            and all(_valid_entry(entry) for entry in record["entries"])
        )
    return validate_media_reference(record["media_content_id"]) and all(
        _valid_display_value(record[field], maximum)
        for field, maximum in (
            ("title", MAX_TITLE_BYTES),
            ("media_class", MAX_MEDIA_CLASS_BYTES),
            ("media_content_type", MAX_CONTENT_TYPE_BYTES),
        )
        if field in record
    )


@trace_call
def _serialized_size(data: dict[str, Any]) -> int:
    return len(
        json.dumps(data, ensure_ascii=False, allow_nan=False, separators=(",", ":")).encode("utf-8")
    )


@trace_call
def validate_library_document(data: Any) -> bool:
    """Return whether a canonical library satisfies every persisted bound."""
    if (
        not isinstance(data, dict)
        or set(data) != {"schema_version", "revision", "records"}
        or data["schema_version"] != LIBRARY_SCHEMA_VERSION
        or isinstance(data["schema_version"], bool)
        or not isinstance(data["revision"], int)
        or isinstance(data["revision"], bool)
        or data["revision"] < 0
        or not isinstance(data["records"], list)
        or len(data["records"]) > MAX_RECORDS
    ):
        return False

    record_ids: set[str] = set()
    for record in data["records"]:
        if not _valid_record(record, data["revision"]):
            return False
        if record["record_id"] in record_ids:
            return False
        record_ids.add(record["record_id"])

    try:
        return _serialized_size(data) <= MAX_LIBRARY_BYTES
    except (TypeError, ValueError, UnicodeEncodeError):
        return False


@trace_call
def migrate_library_document(data: Any) -> dict[str, Any]:
    """Migrate the explicitly supported unversioned/v1 document to schema 2."""
    if not isinstance(data, dict):
        raise PlaylistLibraryStorageError
    schema_version = data.get("schema_version", 1)
    if isinstance(schema_version, bool) or not isinstance(schema_version, int):
        raise PlaylistLibraryStorageError
    if schema_version == LIBRARY_SCHEMA_VERSION:
        migrated = deepcopy(data)
    elif schema_version == 1:
        if set(data) not in ({"revision", "records"}, {"schema_version", "revision", "records"}):
            raise PlaylistLibraryStorageError
        revision = data.get("revision")
        records = data.get("records")
        if (
            not isinstance(revision, int)
            or isinstance(revision, bool)
            or revision < 0
            or not isinstance(records, list)
        ):
            raise PlaylistLibraryStorageError
        migrated_records = []
        for record in records:
            if not isinstance(record, dict) or set(record) != _LEGACY_RECORD_FIELDS:
                raise PlaylistLibraryStorageError
            migrated_records.append({**deepcopy(record), "record_revision": revision})
        migrated = {
            "schema_version": LIBRARY_SCHEMA_VERSION,
            "revision": revision,
            "records": migrated_records,
        }
    else:
        raise PlaylistLibraryStorageError

    if not validate_library_document(migrated):
        raise PlaylistLibraryStorageError
    return migrated


class PlaylistLibrary:
    """Own one serialized Home Assistant Store for the lifetime of HA."""

    @trace_call
    def __init__(self, hass: Any) -> None:
        from homeassistant.helpers.storage import Store

        self.hass = hass
        self.store = Store(
            hass,
            LIBRARY_STORE_VERSION,
            LIBRARY_STORE_KEY,
            atomic_writes=True,
        )
        self.lock = asyncio.Lock()
        self.data: dict[str, Any] | None = None
        self.storage_failed = False

    @trace_call
    async def async_list(self) -> dict[str, Any]:
        """Return the current library snapshot."""
        async with self.lock:
            return deepcopy(await self._async_load_locked())

    @trace_call
    async def async_reload(self) -> dict[str, Any]:
        """Retry a failed load or save after an operator repairs storage."""
        async with self.lock:
            self.data = None
            self.storage_failed = False
            return deepcopy(await self._async_load_locked())

    @trace_call
    async def async_save_custom(
        self,
        record_id: str,
        name: str,
        entries: list[dict[str, Any]],
        expected_revision: int,
    ) -> dict[str, Any]:
        """Create, update, reorder, or idempotently retry a custom playlist."""
        async with self.lock:
            current = await self._async_load_locked()
            self._validate_custom(record_id, name, entries, expected_revision)
            existing = next(
                (record for record in current["records"] if record["record_id"] == record_id),
                None,
            )
            candidate = {
                "record_id": record_id,
                "record_revision": current["revision"] + 1,
                "kind": "custom",
                "name": name.strip(),
                "entries": deepcopy(entries),
            }
            if existing is not None:
                if all(
                    existing[field] == candidate[field]
                    for field in ("record_id", "kind", "name", "entries")
                ):
                    return deepcopy(current)
                if (
                    expected_revision > current["revision"]
                    or expected_revision < existing["record_revision"]
                ):
                    raise PlaylistLibraryConflictError
                records = [
                    candidate if record["record_id"] == record_id else record
                    for record in current["records"]
                ]
            else:
                if expected_revision > current["revision"]:
                    raise PlaylistLibraryConflictError
                if len(current["records"]) >= MAX_RECORDS:
                    raise PlaylistLibraryValidationError
                records = [*current["records"], candidate]

            updated = {
                "schema_version": LIBRARY_SCHEMA_VERSION,
                "revision": current["revision"] + 1,
                "records": records,
            }
            if not validate_library_document(updated):
                raise PlaylistLibraryValidationError
            await self._async_save_locked(updated)
            return deepcopy(updated)

    @trace_call
    async def async_delete_custom(self, record_id: str, expected_revision: int) -> dict[str, Any]:
        """Delete one custom record if it has not changed since the caller read it."""
        async with self.lock:
            current = await self._async_load_locked()
            if not _valid_uuid(record_id) or not _valid_revision(expected_revision):
                raise PlaylistLibraryValidationError
            existing = next(
                (record for record in current["records"] if record["record_id"] == record_id),
                None,
            )
            if existing is None or existing["kind"] != "custom":
                raise PlaylistLibraryNotFoundError
            if (
                expected_revision > current["revision"]
                or expected_revision < existing["record_revision"]
            ):
                raise PlaylistLibraryConflictError
            updated = {
                "schema_version": LIBRARY_SCHEMA_VERSION,
                "revision": current["revision"] + 1,
                "records": [record for record in current["records"] if record["record_id"] != record_id],
            }
            await self._async_save_locked(updated)
            return deepcopy(updated)

    @trace_call
    async def async_update_custom(
        self,
        record_id: str,
        name: str,
        entries: list[dict[str, Any]],
        expected_revision: int,
    ) -> dict[str, Any]:
        """Replace one existing custom playlist with revision protection."""
        self._validate_custom(record_id, name, entries, expected_revision)
        async with self.lock:
            current = await self._async_load_locked()
            existing = next(
                (record for record in current["records"] if record["record_id"] == record_id),
                None,
            )
            if existing is None or existing["kind"] != "custom":
                raise PlaylistLibraryNotFoundError
            if (
                expected_revision > current["revision"]
                or expected_revision < existing["record_revision"]
            ):
                raise PlaylistLibraryConflictError
            if (
                existing["name"] == name.strip()
                and existing["entries"] == entries
            ):
                return deepcopy(current)

            candidate = {
                "record_id": record_id,
                "record_revision": current["revision"] + 1,
                "kind": "custom",
                "name": name.strip(),
                "entries": deepcopy(entries),
            }
            updated = {
                "schema_version": LIBRARY_SCHEMA_VERSION,
                "revision": current["revision"] + 1,
                "records": [
                    candidate if record["record_id"] == record_id else record
                    for record in current["records"]
                ],
            }
            if not validate_library_document(updated):
                raise PlaylistLibraryValidationError
            await self._async_save_locked(updated)
            return deepcopy(updated)

    @trace_call
    async def async_save_provider(
        self,
        media_content_id: str,
        name: str,
        metadata: dict[str, str],
    ) -> dict[str, Any]:
        """Save one opaque provider playlist reference without expanding its contents."""
        if (
            not validate_media_reference(media_content_id)
            or not _valid_display_value(name, MAX_NAME_BYTES, required=True)
            or not isinstance(metadata, dict)
            or not set(metadata) <= _PROVIDER_OPTIONAL_FIELDS
            or not all(
                _valid_display_value(metadata[field], maximum)
                for field, maximum in (
                    ("title", MAX_TITLE_BYTES),
                    ("media_class", MAX_MEDIA_CLASS_BYTES),
                    ("media_content_type", MAX_CONTENT_TYPE_BYTES),
                )
                if field in metadata
            )
        ):
            raise PlaylistLibraryValidationError

        async with self.lock:
            current = await self._async_load_locked()
            existing = next(
                (
                    record
                    for record in current["records"]
                    if record["kind"] == "provider"
                    and record["media_content_id"] == media_content_id
                ),
                None,
            )
            if existing is not None:
                return deepcopy(current)
            if len(current["records"]) >= MAX_RECORDS:
                raise PlaylistLibraryValidationError
            candidate = {
                "record_id": str(uuid4()),
                "record_revision": current["revision"] + 1,
                "kind": "provider",
                "name": name.strip(),
                "media_content_id": media_content_id,
                **metadata,
            }
            updated = {
                "schema_version": LIBRARY_SCHEMA_VERSION,
                "revision": current["revision"] + 1,
                "records": [*current["records"], candidate],
            }
            if not validate_library_document(updated):
                raise PlaylistLibraryValidationError
            await self._async_save_locked(updated)
            return deepcopy(updated)

    @trace_call
    async def async_rename_provider(
        self, record_id: str, name: str, expected_revision: int
    ) -> dict[str, Any]:
        """Rename only the local provider shortcut label."""
        if (
            not _valid_uuid(record_id)
            or not _valid_display_value(name, MAX_NAME_BYTES, required=True)
            or not _valid_revision(expected_revision)
        ):
            raise PlaylistLibraryValidationError
        async with self.lock:
            current = await self._async_load_locked()
            existing = next(
                (record for record in current["records"] if record["record_id"] == record_id),
                None,
            )
            if existing is None or existing["kind"] != "provider":
                raise PlaylistLibraryNotFoundError
            if (
                expected_revision > current["revision"]
                or expected_revision < existing["record_revision"]
            ):
                raise PlaylistLibraryConflictError
            if existing["name"] == name.strip():
                return deepcopy(current)
            candidate = {**existing, "name": name.strip(), "record_revision": current["revision"] + 1}
            updated = {
                "schema_version": LIBRARY_SCHEMA_VERSION,
                "revision": current["revision"] + 1,
                "records": [
                    candidate if record["record_id"] == record_id else record
                    for record in current["records"]
                ],
            }
            if not validate_library_document(updated):
                raise PlaylistLibraryValidationError
            await self._async_save_locked(updated)
            return deepcopy(updated)

    @trace_call
    async def async_delete_provider(
        self, record_id: str, expected_revision: int
    ) -> dict[str, Any]:
        """Remove only one local provider shortcut."""
        if not _valid_uuid(record_id) or not _valid_revision(expected_revision):
            raise PlaylistLibraryValidationError
        async with self.lock:
            current = await self._async_load_locked()
            existing = next(
                (record for record in current["records"] if record["record_id"] == record_id),
                None,
            )
            if existing is None or existing["kind"] != "provider":
                raise PlaylistLibraryNotFoundError
            if (
                expected_revision > current["revision"]
                or expected_revision < existing["record_revision"]
            ):
                raise PlaylistLibraryConflictError
            updated = {
                "schema_version": LIBRARY_SCHEMA_VERSION,
                "revision": current["revision"] + 1,
                "records": [record for record in current["records"] if record["record_id"] != record_id],
            }
            await self._async_save_locked(updated)
            return deepcopy(updated)

    @staticmethod
    @trace_call
    def _validate_custom(
        record_id: str,
        name: str,
        entries: list[dict[str, Any]],
        expected_revision: int,
    ) -> None:
        if (
            not _valid_uuid(record_id)
            or not _valid_display_value(name, MAX_NAME_BYTES, required=True)
            or not isinstance(entries, list)
            or len(entries) > MAX_CUSTOM_ENTRIES
            or not _valid_revision(expected_revision)
            or not all(_valid_entry(entry) for entry in entries)
        ):
            raise PlaylistLibraryValidationError

    @staticmethod
    @trace_call
    def _valid_library(data: Any) -> bool:
        return validate_library_document(data)

    @trace_call
    async def _async_load_locked(self) -> dict[str, Any]:
        if self.storage_failed:
            raise PlaylistLibraryStorageError
        if self.data is not None:
            return self.data

        path = Path(self.store.path)
        try:
            path_existed = await self.hass.async_add_executor_job(path.exists)
            quarantine_existed = await self.hass.async_add_executor_job(
                lambda: any(
                    candidate.is_file()
                    for candidate in (
                        path.with_suffix(".corrupt"),
                        path.with_suffix(path.suffix + ".corrupt"),
                    )
                )
                or any(candidate.is_file() for candidate in path.parent.glob(f"{path.name}.corrupt.*"))
            )
            stored = await self.store.async_load()
        except Exception:
            self.storage_failed = True
            raise PlaylistLibraryStorageError from None

        if stored is None:
            if path_existed or quarantine_existed:
                self.storage_failed = True
                raise PlaylistLibraryStorageError
            self.data = deepcopy(_EMPTY_LIBRARY)
            return self.data

        try:
            migrated = migrate_library_document(stored)
        except PlaylistLibraryStorageError:
            self.storage_failed = True
            raise
        if migrated != stored:
            await self._async_save_locked(migrated)
        else:
            self.data = deepcopy(migrated)
        return self.data

    @trace_call
    async def _async_save_locked(self, data: dict[str, Any]) -> None:
        try:
            await self.store.async_save(data)
            from homeassistant.util import json as json_util

            envelope = await self.hass.async_add_executor_job(json_util.load_json, self.store.path)
        except Exception:
            self.storage_failed = True
            raise PlaylistLibraryStorageError from None
        if not isinstance(envelope, dict) or envelope.get("data") != data:
            self.storage_failed = True
            raise PlaylistLibraryStorageError
        self.data = deepcopy(data)


@trace_call
def _valid_revision(revision: Any) -> bool:
    return isinstance(revision, int) and not isinstance(revision, bool) and revision >= 0


_ENTRY_SCHEMA = vol.Schema(
    {
        vol.Required("media_content_id"): str,
        vol.Optional("title"): str,
        vol.Optional("media_class"): str,
        vol.Optional("media_content_type"): str,
    }
)
_LIST_SCHEMA = {vol.Required("type"): "bl_haos/playlist_library/list"}
_SAVE_CUSTOM_SCHEMA = {
    vol.Required("type"): "bl_haos/playlist_library/save_custom",
    vol.Required("record_id"): str,
    vol.Required("name"): str,
    vol.Required("entries"): vol.All(list, [_ENTRY_SCHEMA]),
    vol.Required("revision"): vol.All(int, vol.Range(min=0)),
}
_UPDATE_CUSTOM_SCHEMA = {
    vol.Required("type"): "bl_haos/playlist_library/update_custom",
    vol.Required("record_id"): str,
    vol.Required("name"): str,
    vol.Required("entries"): vol.All(list, [_ENTRY_SCHEMA]),
    vol.Required("revision"): vol.All(int, vol.Range(min=0)),
}
_DELETE_CUSTOM_SCHEMA = {
    vol.Required("type"): "bl_haos/playlist_library/delete_custom",
    vol.Required("record_id"): str,
    vol.Required("revision"): vol.All(int, vol.Range(min=0)),
}
_SAVE_PROVIDER_SCHEMA = probatio.All(
    probatio.Schema(
        {
            probatio.Required("type"): "bl_haos/playlist_library/save_provider",
            probatio.Required("media_content_id"): str,
            probatio.Required("name"): str,
            probatio.Optional("title"): str,
            probatio.Optional("media_class"): str,
            probatio.Optional("media_content_type"): str,
        },
        extra=probatio.ALLOW_EXTRA,
    )
)
_RENAME_PROVIDER_SCHEMA = {
    vol.Required("type"): "bl_haos/playlist_library/rename_provider",
    vol.Required("record_id"): str,
    vol.Required("name"): str,
    vol.Required("revision"): vol.All(int, vol.Range(min=0)),
}
_DELETE_PROVIDER_SCHEMA = {
    vol.Required("type"): "bl_haos/playlist_library/delete_provider",
    vol.Required("record_id"): str,
    vol.Required("revision"): vol.All(int, vol.Range(min=0)),
}
_START_PLAYLIST_SCHEMA = {
    vol.Required("type"): "bl_haos/playlist_library/start",
    vol.Required("record_id"): vol.All(
        str,
        vol.Match(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"),
    ),
    vol.Required("entity_id"): vol.Match(r"^media_player\.[a-z0-9_]+$"),
}


@trace_call
async def websocket_list_library(hass: Any, connection: Any, message: dict[str, Any]) -> None:
    """Return the shared installation-wide library to an authenticated HA user."""
    from homeassistant.components import websocket_api

    library: PlaylistLibrary = hass.data[LIBRARY_DATA]
    try:
        result = await library.async_list()
    except PlaylistLibraryStorageError:
        connection.send_error(message["id"], websocket_api.ERR_UNKNOWN_ERROR, "Unable to read playlist library")
        return
    connection.send_result(message["id"], result)


@trace_call
async def websocket_save_custom(hass: Any, connection: Any, message: dict[str, Any]) -> None:
    """Create or update a custom playlist through HA's authenticated connection."""
    from homeassistant.components import websocket_api

    library: PlaylistLibrary = hass.data[LIBRARY_DATA]
    try:
        result = await library.async_save_custom(
            message["record_id"],
            message["name"],
            message["entries"],
            message["revision"],
        )
    except PlaylistLibraryValidationError:
        connection.send_error(message["id"], websocket_api.ERR_INVALID_FORMAT, "Invalid playlist record")
        return
    except PlaylistLibraryConflictError:
        connection.send_error(message["id"], websocket_api.ERR_UNKNOWN_ERROR, "Playlist library changed; reload and retry")
        return
    except PlaylistLibraryStorageError:
        connection.send_error(message["id"], websocket_api.ERR_UNKNOWN_ERROR, "Unable to save playlist library")
        return
    connection.send_result(message["id"], result)


@trace_call
async def websocket_update_custom(hass: Any, connection: Any, message: dict[str, Any]) -> None:
    """Update an existing custom playlist through HA's authenticated connection."""
    from homeassistant.components import websocket_api

    library: PlaylistLibrary = hass.data[LIBRARY_DATA]
    try:
        result = await library.async_update_custom(
            message["record_id"],
            message["name"],
            message["entries"],
            message["revision"],
        )
    except PlaylistLibraryValidationError:
        connection.send_error(message["id"], websocket_api.ERR_INVALID_FORMAT, "Invalid playlist record")
        return
    except PlaylistLibraryNotFoundError:
        connection.send_error(message["id"], websocket_api.ERR_NOT_FOUND, "Playlist record not found")
        return
    except PlaylistLibraryConflictError:
        connection.send_error(message["id"], websocket_api.ERR_UNKNOWN_ERROR, "Playlist library changed; reload and retry")
        return
    except PlaylistLibraryStorageError:
        connection.send_error(message["id"], websocket_api.ERR_UNKNOWN_ERROR, "Unable to save playlist library")
        return
    connection.send_result(message["id"], result)


@trace_call
async def websocket_delete_custom(hass: Any, connection: Any, message: dict[str, Any]) -> None:
    """Delete a custom playlist through HA's authenticated connection."""
    from homeassistant.components import websocket_api

    library: PlaylistLibrary = hass.data[LIBRARY_DATA]
    try:
        result = await library.async_delete_custom(message["record_id"], message["revision"])
    except PlaylistLibraryValidationError:
        connection.send_error(message["id"], websocket_api.ERR_INVALID_FORMAT, "Invalid playlist record")
        return
    except PlaylistLibraryNotFoundError:
        connection.send_error(message["id"], websocket_api.ERR_NOT_FOUND, "Playlist record not found")
        return
    except PlaylistLibraryConflictError:
        connection.send_error(message["id"], websocket_api.ERR_UNKNOWN_ERROR, "Playlist library changed; reload and retry")
        return
    except PlaylistLibraryStorageError:
        connection.send_error(message["id"], websocket_api.ERR_UNKNOWN_ERROR, "Unable to save playlist library")
        return
    connection.send_result(message["id"], result)


@trace_call
async def websocket_save_provider(hass: Any, connection: Any, message: dict[str, Any]) -> None:
    """Save one exact HA-browse provider reference as a local shortcut."""
    from homeassistant.components import websocket_api

    allowed_fields = {"id", "type", "media_content_id", "name"} | _PROVIDER_OPTIONAL_FIELDS
    if not set(message) <= allowed_fields:
        connection.send_error(message["id"], websocket_api.ERR_INVALID_FORMAT, "Invalid playlist record")
        return

    library: PlaylistLibrary = hass.data[LIBRARY_DATA]
    metadata = {
        field: message[field]
        for field in ("title", "media_class", "media_content_type")
        if field in message
    }
    try:
        result = await library.async_save_provider(
            message["media_content_id"], message["name"], metadata
        )
    except PlaylistLibraryValidationError:
        connection.send_error(message["id"], websocket_api.ERR_INVALID_FORMAT, "Invalid playlist record")
        return
    except PlaylistLibraryStorageError:
        connection.send_error(message["id"], websocket_api.ERR_UNKNOWN_ERROR, "Unable to save playlist library")
        return
    connection.send_result(message["id"], result)


@trace_call
async def websocket_rename_provider(hass: Any, connection: Any, message: dict[str, Any]) -> None:
    """Rename the local label for one provider shortcut."""
    from homeassistant.components import websocket_api

    library: PlaylistLibrary = hass.data[LIBRARY_DATA]
    try:
        result = await library.async_rename_provider(
            message["record_id"], message["name"], message["revision"]
        )
    except PlaylistLibraryValidationError:
        connection.send_error(message["id"], websocket_api.ERR_INVALID_FORMAT, "Invalid playlist record")
        return
    except PlaylistLibraryNotFoundError:
        connection.send_error(message["id"], websocket_api.ERR_NOT_FOUND, "Playlist record not found")
        return
    except PlaylistLibraryConflictError:
        connection.send_error(message["id"], websocket_api.ERR_UNKNOWN_ERROR, "Playlist library changed; reload and retry")
        return
    except PlaylistLibraryStorageError:
        connection.send_error(message["id"], websocket_api.ERR_UNKNOWN_ERROR, "Unable to save playlist library")
        return
    connection.send_result(message["id"], result)


@trace_call
async def websocket_delete_provider(hass: Any, connection: Any, message: dict[str, Any]) -> None:
    """Remove a provider shortcut from the local library only."""
    from homeassistant.components import websocket_api

    library: PlaylistLibrary = hass.data[LIBRARY_DATA]
    try:
        result = await library.async_delete_provider(message["record_id"], message["revision"])
    except PlaylistLibraryValidationError:
        connection.send_error(message["id"], websocket_api.ERR_INVALID_FORMAT, "Invalid playlist record")
        return
    except PlaylistLibraryNotFoundError:
        connection.send_error(message["id"], websocket_api.ERR_NOT_FOUND, "Playlist record not found")
        return
    except PlaylistLibraryConflictError:
        connection.send_error(message["id"], websocket_api.ERR_UNKNOWN_ERROR, "Playlist library changed; reload and retry")
        return
    except PlaylistLibraryStorageError:
        connection.send_error(message["id"], websocket_api.ERR_UNKNOWN_ERROR, "Unable to save playlist library")
        return
    connection.send_result(message["id"], result)


@trace_call
async def websocket_start_playlist(hass: Any, connection: Any, message: dict[str, Any]) -> None:
    """Resolve one canonical saved record and start it on the explicitly selected entity."""
    from homeassistant.components import websocket_api
    from homeassistant.exceptions import HomeAssistantError

    library: PlaylistLibrary = hass.data[LIBRARY_DATA]
    try:
        snapshot = await library.async_list()
    except PlaylistLibraryStorageError:
        connection.send_error(message["id"], websocket_api.ERR_UNKNOWN_ERROR, "Unable to read playlist library")
        return

    record = next(
        (candidate for candidate in snapshot["records"] if candidate["record_id"] == message["record_id"]),
        None,
    )
    if record is None:
        connection.send_error(message["id"], websocket_api.ERR_NOT_FOUND, "Playlist record not found")
        return

    component = hass.data.get("entity_components", {}).get(MEDIA_PLAYER_DOMAIN)
    player = component.get_entity(message["entity_id"]) if component is not None else None
    from .media_player import BLHAOSMediaPlayer

    if not isinstance(player, BLHAOSMediaPlayer) or player.entity_id != message["entity_id"]:
        connection.send_error(message["id"], websocket_api.ERR_NOT_FOUND, "Selected BL-HAOS speaker is unavailable")
        return

    try:
        item_count = await player.async_start_queue(record)
    except HomeAssistantError as error:
        connection.send_error(message["id"], websocket_api.ERR_UNKNOWN_ERROR, str(error))
        return
    connection.send_result(
        message["id"],
        {"record_id": record["record_id"], "entity_id": player.entity_id, "items": item_count},
    )


@trace_call
async def async_setup(hass: Any, _config: dict[str, Any]) -> bool:
    """Register authenticated playlist commands once per Home Assistant runtime."""
    from homeassistant.components import websocket_api

    if LIBRARY_DATA in hass.data:
        return True
    hass.data[LIBRARY_DATA] = PlaylistLibrary(hass)
    for handler, schema in (
        (websocket_list_library, _LIST_SCHEMA),
        (websocket_save_custom, _SAVE_CUSTOM_SCHEMA),
        (websocket_update_custom, _UPDATE_CUSTOM_SCHEMA),
        (websocket_delete_custom, _DELETE_CUSTOM_SCHEMA),
        (websocket_save_provider, _SAVE_PROVIDER_SCHEMA),
        (websocket_rename_provider, _RENAME_PROVIDER_SCHEMA),
        (websocket_delete_provider, _DELETE_PROVIDER_SCHEMA),
        (websocket_start_playlist, _START_PLAYLIST_SCHEMA),
    ):
        command = websocket_api.async_response(handler)
        command = websocket_api.websocket_command(schema)(command)
        websocket_api.async_register_command(hass, command)
    return True