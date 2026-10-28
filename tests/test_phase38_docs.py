import json
from pathlib import Path

from custom_components.bl_haos.compatibility import (
    MINIMUM_ADDON_VERSION, evaluate_identity, get_installed_integration_version,
)

README = Path(__file__).resolve().parents[1] / "README.md"
COMPONENT = Path(__file__).resolve().parents[1] / "custom_components" / "bl_haos"


def test_phase38_manifest_compatibility_and_documentation_matrix():
    manifest = json.loads((COMPONENT / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["version"] == "0.2.22"
    assert MINIMUM_ADDON_VERSION == "0.2.70"
    assert evaluate_identity({"bridge_id": "bl_haos_native_bridge", "version": 1, "addon_version": "0.2.71", "min_integration_version": "0.2.22"}, manifest["version"]).status == "compatible"
    docs = " ".join(README.read_text(encoding="utf-8").lower().replace("**", "").split())
    for claim in ("integration first", "0.2.71", "0.2.22", "0.2.70", "0.2.69", "0.2.21", "unknown_legacy", "home assistant repairs", "rollback", "old ingress links", "phase 39"):
        assert claim in docs, f"missing compatibility/migration claim: {claim}"
    assert "native protocol `version: 1`" in docs


def test_current_integration_docs_do_not_claim_retired_ingress_controls():
    docs = README.read_text(encoding="utf-8").replace("**", "")
    assert "Ingress SpeakerCard" not in docs
    assert "Ingress remains the browser-facing path" not in docs
    assert "Open Media Catalog" in docs
    assert "Speakers view" in docs


def test_installed_integration_version_is_still_manifest_driven():
    manifest = json.loads((COMPONENT / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["version"] == "0.2.22"
