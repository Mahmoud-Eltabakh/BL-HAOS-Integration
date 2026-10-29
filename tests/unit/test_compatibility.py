"""Stable product-version compatibility matrix tests."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from custom_components.bl_haos.compatibility import (  # noqa: E402
    MINIMUM_ADDON_VERSION,
    evaluate_identity,
    get_installed_integration_version,
)


def identity(**updates):
    value = {"bridge_id": "bl_haos_native_bridge", "version": 1, "addon_version": "0.2.70", "min_integration_version": "0.2.22", "queue_version": 1}
    value.update(updates)
    return value


def test_equal_and_newer_stable_versions_are_compatible():
    assert evaluate_identity(identity(), "0.2.22").status == "compatible"
    assert evaluate_identity(identity(addon_version="0.2.71"), "0.2.24").status == "compatible"
    assert evaluate_identity(identity(addon_version="1.0.0"), "1.0.0").status == "compatible"


def test_semantic_comparison_is_numeric_not_lexical():
    assert evaluate_identity(identity(addon_version="0.2.100"), "0.2.22").status == "compatible"
    assert evaluate_identity(identity(addon_version="0.2.69"), "0.2.22").reason == "addon_too_old"
    assert evaluate_identity(identity(min_integration_version="0.2.10"), "0.2.9").reason == "integration_too_old"


def test_lower_integration_and_addon_candidates_are_rejected():
    assert evaluate_identity(identity(), "0.2.21").reason == "integration_too_old"
    assert evaluate_identity(identity(addon_version="0.2.69"), "0.2.22").reason == "addon_too_old"
    assert MINIMUM_ADDON_VERSION == "0.2.70"


def test_both_absent_product_fields_are_explicit_legacy_only():
    result = evaluate_identity({"bridge_id": "bl_haos_native_bridge", "version": 1}, "0.2.22")
    assert result.status == "unknown_legacy"
    assert result.reason == "legacy_metadata_missing"


def test_partial_invalid_and_prerelease_metadata_are_incompatible():
    assert evaluate_identity(identity(min_integration_version=None), "0.2.22").reason == "invalid_version_metadata"
    assert evaluate_identity(identity(addon_version="0.2.71-rc1"), "0.2.22").reason == "invalid_version_metadata"
    assert evaluate_identity(identity(addon_version=71), "0.2.22").reason == "invalid_version_metadata"
    assert evaluate_identity(identity(addon_version="v0.2.71"), "0.2.22").reason == "invalid_version_metadata"


def test_protocol_is_strict_and_queue_version_is_not_a_product_version():
    assert evaluate_identity(identity(version=True), "0.2.22").reason == "unsupported_protocol"
    assert evaluate_identity(identity(version="1"), "0.2.22").reason == "unsupported_protocol"
    assert evaluate_identity(identity(version=2), "0.2.22").reason == "unsupported_protocol"
    assert evaluate_identity(identity(queue_version=999), "0.2.22").status == "compatible"


async def test_installed_integration_version_comes_from_its_manifest():
    from types import SimpleNamespace

    assert await get_installed_integration_version(SimpleNamespace()) == "0.2.27"
