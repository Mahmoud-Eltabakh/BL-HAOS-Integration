"""Static package checks that do not require a Home Assistant runtime."""

import json
import re
from pathlib import Path

ROOT = Path(__file__).parents[1]
COMPONENT = ROOT / "custom_components" / "bl_haos"

REQUIRED_PHASE_24_DOC_CLAIMS = {
    "README.md": ("Open Media Catalog", "Native Browse Media", "exactly one connected BL-HAOS speaker", "HA owns provider authentication and reference resolution", "Phase 25", "Phase 26", "undeployed", "2026.10.3"),
    "TESTING.md": ("BLHAOS_HA_URL", "BLHAOS_HA_STORAGE_STATE", "BLHAOS_HA_TARGET", "BLHAOS_HA_PROVIDER_ID", "BLHAOS_HA_PLAYLIST_ID", "BLHAOS_HA_ALLOW_PLAYBACK", "BLHAOS_HA_EXPIRY_STORAGE_STATE", "actual expiry remains pending", "2026.10.3", "--ignore=tests/unit", "PYTEST_DISABLE_PLUGIN_AUTOLOAD=1", "375", "768", "1440"),
    "modules/integration/README.md": ("Open Media Catalog", "Native Browse Media", "exactly one connected BL-HAOS speaker", "HA owns provider authentication and reference resolution", "Phase 25", "Phase 26", "undeployed", "2026.10.3"),
}

FORBIDDEN_PHASE_24_DOC_CLAIMS = (
    r"\b(?:the )?(?:panel|browser|add-on) (?:stores|persists|copies) (?:ha |home assistant |provider )?(?:tokens|credentials)",
    r"\b(?:the )?bridge (?:proxies|resolves|authenticates) (?:the )?(?:catalog|provider|media-source)",
    r"\bphase 24 (?:implements|provides|supports|includes) (?:saved playlist (?:crud|creation|editing)|queue controls|sequential playback)",
    r"(?<!not )\b(?:use|run) (?:the )?(?:retired )?docker e2e (?:for|as) (?:phase 24 |host )?acceptance",
)


def test_phase24_required_documentation_claims():
    repo = ROOT.parents[1]
    for relative, fragments in REQUIRED_PHASE_24_DOC_CLAIMS.items():
        text = (repo / relative).read_text(encoding="utf-8")
        for fragment in fragments:
            assert fragment in text, f"{relative}: missing Phase 24 claim: {fragment}"


def test_phase24_forbidden_documentation_claims():
    repo = ROOT.parents[1]
    for relative in REQUIRED_PHASE_24_DOC_CLAIMS:
        text = " ".join((repo / relative).read_text(encoding="utf-8").lower().split())
        for pattern in FORBIDDEN_PHASE_24_DOC_CLAIMS:
            assert not re.search(pattern, text), f"{relative}: forbidden positive Phase 24 claim"


def test_phase24_claim_guards_distinguish_exclusions():
    positives = ("The panel stores HA tokens", "The bridge resolves provider references", "Phase 24 implements saved playlist CRUD", "Use Docker E2E for host acceptance")
    exclusions = ("The panel does not store HA tokens", "The bridge does not resolve provider references", "Phase 24 does not implement saved playlist CRUD or queue controls", "Do not use Docker E2E for host acceptance")
    for claim in positives:
        assert any(re.search(pattern, claim.lower()) for pattern in FORBIDDEN_PHASE_24_DOC_CLAIMS)
    for claim in exclusions:
        assert not any(re.search(pattern, claim.lower()) for pattern in FORBIDDEN_PHASE_24_DOC_CLAIMS)


def test_phase24_host_harness_is_separate_and_artifacts_are_private():
    panel = ROOT / "panel_ui"
    package = json.loads((panel / "package.json").read_text(encoding="utf-8"))
    lock = json.loads((panel / "package-lock.json").read_text(encoding="utf-8"))
    assert package["devDependencies"]["@playwright/test"] == "1.63.0"
    assert lock["packages"][""]["devDependencies"] == package["devDependencies"]
    assert package["scripts"]["test:host"] == "playwright test --config e2e/playwright.config.ts"
    config = (panel / "e2e" / "playwright.config.ts").read_text(encoding="utf-8")
    for fragment in ("trace: 'off'", "video: 'off'", "screenshot: 'off'", "safe-reporter.mjs", "retries: 0", "loadHostEnvironment"):
        assert fragment in config
    assert "webServer" not in config and "BLHAOS_DEMO" not in config
    assert "test-results/" in (panel / ".gitignore").read_text(encoding="utf-8")
    reporter = (panel / "e2e" / "safe-reporter.mjs").read_text(encoding="utf-8")
    assert "result.error" not in reporter and "result.attachments" not in reporter
    spec = (panel / "e2e" / "catalog.spec.ts").read_text(encoding="utf-8")
    for fragment in ("2026.10.3", "[375, 768, 1440]", "shadowRoot", "host.expiryStorageState", "host.target", "host.playlist"):
        assert fragment in spec
    for forbidden in ("test.skip", "test.fixme", "test.fail(", "storageState()", "recordHar", "recordVideo", "page.route(", "localStorage", "sessionStorage"):
        assert forbidden not in spec


def test_hacs_component_layout_and_manifest():
    required = {"__init__.py", "client.py", "config_flow.py", "const.py", "manifest.json", "media_player.py"}
    assert required <= {path.name for path in COMPONENT.iterdir()}
    manifest = json.loads((COMPONENT / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["domain"] == "bl_haos"
    assert manifest["config_flow"] is True
    assert manifest["version"] == "0.2.20"


def test_native_transport_is_discovery_based_and_mqtt_free():
    source = "\n".join(path.read_text(encoding="utf-8") for path in COMPONENT.glob("*.py"))
    assert "async_step_hassio" in source
    assert "_endpoint_from_hassio_slug" in source
    assert "/identity" in source
    assert "ws_connect" in source
    assert "mqtt" not in source.lower()


def test_client_speaker_filter_logic():
    # Verify the regex and parsing rules without HA runtime dependencies
    import re
    mac_regex = re.compile(r"^[0-9a-f]{2}(?::[0-9a-f]{2}){5}$")
    normalized = "EC-81-93-53-A9-16".strip().lower().replace("-", ":")
    assert mac_regex.fullmatch(normalized) is not None


def test_test_strategy_artifacts_are_checked_in():
    """The layered test strategy (TESTING.md) must stay checked in and current."""
    repo = ROOT.parents[1]
    assert (repo / "TESTING.md").is_file()
    assert (repo / "scripts" / "run-tests.ps1").is_file()
    assert (repo / "scripts" / "run-tests.sh").is_file()
    assert (repo / ".github" / "workflows" / "tests.yml").is_file()
    assert (ROOT / "pytest.ini").is_file()
    assert (ROOT / "requirements-sil.txt").is_file()
    assert (repo / "modules" / "bridge" / "backend" / "requirements-test.txt").is_file()
    assert (repo / "modules" / "bridge" / "web_ui" / "e2e" / "playwright.config.ts").is_file()


def test_unit_stubs_enable_windows_client_tests():
    stub_dir = Path(__file__).parent / "ha_stubs" / "homeassistant"
    for stub in ("core.py", "config_entries.py", "exceptions.py"):
        assert (stub_dir / stub).is_file()
    assert (stub_dir / "helpers" / "aiohttp_client.py").is_file()


def test_panel_build_source_and_stable_bundle_contract():
    panel = ROOT / "panel_ui"
    assert (panel / "src" / "media-panel.tsx").is_file()
    package = json.loads((panel / "package.json").read_text(encoding="utf-8"))
    assert package["scripts"]["build"] == "tsc && vite build"
    assert all(not pin.startswith(("^", "~")) for pin in package["dependencies"].values())
    assert (panel / "package-lock.json").is_file()
    bundle = COMPONENT / "panel_static" / "bl-haos-media-panel.js"
    assert bundle.is_file()
    assert {path.name for path in bundle.parent.iterdir()} == {bundle.name}
    compiled = bundle.read_text(encoding="utf-8")
    assert "bl-haos-media-panel" in compiled
    assert "--neu-page" in compiled
    source = (panel / "src" / "media-panel.tsx").read_text(encoding="utf-8")
    for forbidden in ("localStorage", "sessionStorage", "resolve_media", "apiClient", "window.", "parent.", "fetch(", "Authorization", "Bearer "):
        assert forbidden not in source
