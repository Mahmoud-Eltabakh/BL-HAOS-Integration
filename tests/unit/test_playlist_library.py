"""Pure playlist-library validation and migration tests."""

from __future__ import annotations

from copy import deepcopy
from uuid import UUID

import pytest

from custom_components.bl_haos.playlist_library import (
    LIBRARY_SCHEMA_VERSION,
    MAX_CUSTOM_ENTRIES,
    MAX_LIBRARY_BYTES,
    MAX_MEDIA_CLASS_BYTES,
    MAX_MEDIA_ID_BYTES,
    MAX_NAME_BYTES,
    MAX_RECORDS,
    MAX_TITLE_BYTES,
    MAX_CONTENT_TYPE_BYTES,
    PlaylistLibrary,
    PlaylistLibraryStorageError,
    PlaylistLibraryValidationError,
    _serialized_size,
    migrate_library_document,
    validate_library_document,
    validate_media_reference,
)

MEDIA_PREFIX = "media-source://p/"


def _entry(
    media_content_id: str | None = None,
    *,
    title: str = "Track",
    media_class: str = "music",
    media_content_type: str = "audio/mpeg",
) -> dict[str, str]:
    if media_content_id is None:
        media_content_id = MEDIA_PREFIX + "opaque"
    return {
        "media_content_id": media_content_id,
        "title": title,
        "media_class": media_class,
        "media_content_type": media_content_type,
    }


def _record(index: int, entries: list[dict[str, str]] | None = None) -> dict:
    return {
        "record_id": str(UUID(int=index + 1, version=4)),
        "record_revision": 1,
        "kind": "custom",
        "name": f"Playlist {index}",
        "entries": entries or [],
    }


def _document(records: list[dict] | None = None) -> dict:
    return {
        "schema_version": LIBRARY_SCHEMA_VERSION,
        "revision": 1,
        "records": records or [],
    }


def test_playlist_library_pure_field_validation_accepts_exact_byte_and_count_bounds():
    exact_id = MEDIA_PREFIX + "x" * (MAX_MEDIA_ID_BYTES - len(MEDIA_PREFIX))
    exact_entry = _entry(
        exact_id,
        title="t" * MAX_TITLE_BYTES,
        media_class="c" * MAX_MEDIA_CLASS_BYTES,
        media_content_type="m" * MAX_CONTENT_TYPE_BYTES,
    )
    exact_name = "é" * (MAX_NAME_BYTES // 2)
    entries = [exact_entry.copy() for _ in range(MAX_CUSTOM_ENTRIES)]

    PlaylistLibrary._validate_custom(
        "12345678-1234-4234-8234-123456789012",
        exact_name,
        entries,
        0,
    )

    assert len(exact_id.encode("utf-8")) == MAX_MEDIA_ID_BYTES
    assert len(exact_name.encode("utf-8")) == MAX_NAME_BYTES
    assert len(entries) == MAX_CUSTOM_ENTRIES


@pytest.mark.parametrize(
    "name,entries",
    [
        ("é" * 64 + "x", []),
        ("\ud800", []),
        ("Unencodable title", [_entry(title="\ud800")]),
        ("Too long ID", [_entry(MEDIA_PREFIX + "x" * (MAX_MEDIA_ID_BYTES - len(MEDIA_PREFIX) + 1))]),
        ("Too long title", [_entry(title="t" * (MAX_TITLE_BYTES + 1))]),
        ("Too long class", [_entry(media_class="c" * (MAX_MEDIA_CLASS_BYTES + 1))]),
        ("Too long content type", [_entry(media_content_type="m" * (MAX_CONTENT_TYPE_BYTES + 1))]),
        ("Too many entries", [_entry()] * (MAX_CUSTOM_ENTRIES + 1)),
    ],
)
def test_playlist_library_pure_field_validation_rejects_one_byte_or_item_overflow(name, entries):
    with pytest.raises(PlaylistLibraryValidationError):
        PlaylistLibrary._validate_custom(
            "12345678-1234-4234-8234-123456789012",
            name,
            entries,
            0,
        )


def test_playlist_library_pure_aggregate_validation_enforces_record_count_and_exact_document_bytes():
    exact_records = [_record(index) for index in range(MAX_RECORDS)]
    at_record_limit = _document(exact_records)
    assert validate_library_document(at_record_limit)
    assert not validate_library_document(_document([*exact_records, _record(MAX_RECORDS)]))

    records = []
    for record_index in range(4):
        entries = [
            _entry(MEDIA_PREFIX + "x" * (MAX_MEDIA_ID_BYTES - len(MEDIA_PREFIX) - 64), title="")
            for _ in range(MAX_CUSTOM_ENTRIES)
        ]
        records.append(_record(record_index, entries))
    exact_document = _document(records)
    remaining = MAX_LIBRARY_BYTES - _serialized_size(exact_document)
    assert 0 < remaining <= len(records) * MAX_CUSTOM_ENTRIES * MAX_TITLE_BYTES

    for record in exact_document["records"]:
        for entry in record["entries"]:
            addition = min(remaining, MAX_TITLE_BYTES)
            entry["title"] = "t" * addition
            remaining -= addition
            if remaining == 0:
                break
        if remaining == 0:
            break

    assert remaining == 0
    assert _serialized_size(exact_document) == MAX_LIBRARY_BYTES
    assert validate_library_document(exact_document)

    one_byte_over = deepcopy(exact_document)
    entry_to_extend = next(
        entry
        for record in one_byte_over["records"]
        for entry in record["entries"]
        if len(entry["title"]) < MAX_TITLE_BYTES
    )
    entry_to_extend["title"] += "x"
    assert _serialized_size(one_byte_over) == MAX_LIBRARY_BYTES + 1
    assert not validate_library_document(one_byte_over)


@pytest.mark.parametrize(
    "media_content_id",
    [
        "http://provider.test/audio",
        "https://provider.test/audio?token=secret",
        "media-source://p/item?ACCESS_TOKEN=secret",
        "media-source://p/item?Api_Key=secret",
        "media-source://p/item?%61uthorization=secret",
        "media-source://p/item?%2574oken=secret",
        "media-source://p/item?client%255Fsecret=secret",
    ],
)
def test_playlist_library_pure_reference_validation_rejects_urls_and_encoded_credentials(media_content_id):
    assert not validate_media_reference(media_content_id)


def test_playlist_library_pure_reference_validation_preserves_accepted_opaque_id():
    media_content_id = "media-source://provider/opaque%2Fid?order=a%2Bb"

    assert validate_media_reference(media_content_id)
    legacy = {
        "revision": 3,
        "records": [
            {
                "record_id": "12345678-1234-4234-8234-123456789012",
                "kind": "custom",
                "name": "Ordered",
                "entries": [_entry(media_content_id), _entry("media-source://provider/second%2Fid")],
            }
        ],
    }

    migrated = migrate_library_document(legacy)
    migrated_again = migrate_library_document(migrated)

    assert migrated == migrated_again
    assert [entry["media_content_id"] for entry in migrated["records"][0]["entries"]] == [
        media_content_id,
        "media-source://provider/second%2Fid",
    ]


def test_playlist_library_pure_migration_rejects_future_schema_without_mutating_input():
    future = {"schema_version": LIBRARY_SCHEMA_VERSION + 1, "revision": 9, "records": []}
    original = deepcopy(future)

    with pytest.raises(PlaylistLibraryStorageError):
        migrate_library_document(future)

    assert future == original