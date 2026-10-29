import json
from pathlib import Path

from custom_components.bl_haos.compatibility import (
    MINIMUM_ADDON_VERSION, evaluate_identity, get_installed_integration_version,
)

README = Path(__file__).resolve().parents[1] / "README.md"
COMPONENT = Path(__file__).resolve().parents[1] / "custom_components" / "bl_haos"
PROJECT_README = Path(__file__).resolve().parents[3] / "README.md"
BRIDGE_DOCS = Path(__file__).resolve().parents[3] / "modules" / "bridge" / "DOCS.md"


def test_phase38_manifest_compatibility_and_documentation_matrix():
    manifest = json.loads((COMPONENT / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["version"] == "0.2.24"
    assert MINIMUM_ADDON_VERSION == "0.2.70"
    assert evaluate_identity({"bridge_id": "bl_haos_native_bridge", "version": 1, "addon_version": "0.2.71", "min_integration_version": "0.2.22"}, manifest["version"]).status == "compatible"
    docs = " ".join(README.read_text(encoding="utf-8").lower().replace("**", "").split())
    for claim in ("integration first", "0.2.71", "0.2.22", "0.2.70", "0.2.69", "0.2.21", "unknown_legacy", "home assistant repairs", "rollback", "old ingress links", "phase 39"):
        assert claim in docs, f"missing compatibility/migration claim: {claim}"
    assert "native protocol `version: 1`" in docs


def test_current_integration_docs_do_not_claim_retired_ingress_controls():
    docs = " ".join(README.read_text(encoding="utf-8").replace("**", "").split())
    assert "Ingress SpeakerCard" not in docs
    assert "Ingress remains the browser-facing path" not in docs
    assert "Open Media Catalog" in docs
    assert "Speakers view" in docs


def test_installed_integration_version_is_still_manifest_driven():
    manifest = json.loads((COMPONENT / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["version"] == "0.2.24"


def test_phase38_1_dashboard_card_release_and_migration_docs():
    integration_docs = " ".join(README.read_text(encoding="utf-8").lower().split())
    project_docs = " ".join(PROJECT_README.read_text(encoding="utf-8").lower().split())
    bridge_docs = " ".join(BRIDGE_DOCS.read_text(encoding="utf-8").lower().split())
    for location, docs in (
        ("integration README", integration_docs),
        ("root README", project_docs),
    ):
        for claim in (
            "0.2.24",
            "custom:bl-haos-media-card",
            "add card",
            "initial_view",
            "dashboard",
            "bookmark",
            "extra_js_url",
        ):
            assert claim in docs, f"{location}: missing dashboard card claim: {claim}"
    assert "lovelace: resources:" in integration_docs
    assert "no `resources:` entry" in integration_docs
    assert "after the final owner" in integration_docs
    assert "/bl-haos-media" in integration_docs
    assert "no longer registered" in integration_docs
    assert "custom:bl-haos-media-card" in bridge_docs
    assert "dashboard" in bridge_docs
    assert "the `/bl-haos-media` panel" not in bridge_docs
