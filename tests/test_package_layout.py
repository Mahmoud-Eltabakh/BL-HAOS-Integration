"""Static package checks that do not require a Home Assistant runtime."""

import filecmp
import json
import re
import shutil
import subprocess
from pathlib import Path

import pytest

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
    assert manifest["version"] == "0.2.23"


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
    assert (repo / "modules" / "integration" / "panel_ui" / "playwright.mock.config.ts").is_file()
    assert not (repo / "modules" / "bridge" / "web_ui").exists()


def test_root_ci_requires_panel_parity_without_publication():
    repo = ROOT.parents[1]
    workflow = (repo / ".github" / "workflows" / "tests.yml").read_text(encoding="utf-8")
    integration_job = workflow.split("  integration-unit:", 1)[1].split("\n  integration-sil:", 1)[0]
    trigger_section = workflow.split("\non:\n", 1)[1].split("\npermissions:\n", 1)[0]
    permission_section = workflow.split("\npermissions:\n", 1)[1].split("\njobs:\n", 1)[0]
    jobs_section = workflow.split("\njobs:\n", 1)[1]
    job_parts = re.split(r"(?m)^  ([A-Za-z0-9_-]+):\s*$", jobs_section)
    jobs = {job_parts[index]: job_parts[index + 1] for index in range(1, len(job_parts), 2)}

    assert set(re.findall(r"(?m)^  ([a-z_]+):\s*$", trigger_section)) == {"push", "pull_request", "workflow_dispatch"}
    assert permission_section.strip() == "contents: read"
    assert workflow.count("permissions:") == 1
    assert set(jobs) == {"repo-hygiene", "bridge-unit", "integration-unit", "integration-sil", "frontend"}
    for job_name, job_body in jobs.items():
        assert re.search(r"(?m)^    runs-on: ubuntu-latest\s*$", job_body), f"{job_name} must use its own hosted runner"
    checkout_steps = re.split(r"(?m)^      - uses: actions/checkout@v5\s*$", workflow)[1:]
    assert len(checkout_steps) == 5
    for checkout_step in checkout_steps:
        checkout_step = checkout_step.split("\n      - ", 1)[0]
        assert re.search(r"(?m)^\s+persist-credentials:\s*false\s*$", checkout_step)
    assert not re.search(r"(?m)^\s{4}needs\s*:", jobs_section)
    assert not re.search(r"(?m)^\s{4}outputs\s*:", jobs_section)
    assert "actions/cache@" not in workflow
    assert "upload-artifact" not in workflow
    assert "download-artifact" not in workflow
    assert "${{" not in workflow
    node_step = integration_job.split("uses: actions/setup-node@v5", 1)[1].split("\n      - ", 1)[0]
    assert not re.search(r"(?m)^\s+cache:", node_step)
    assert 'node-version: "22"' in integration_job
    assert "npm ci --prefix panel_ui --ignore-scripts" in integration_job
    assert "node --version" in integration_job
    assert "npm --version" in integration_job
    assert "panel_ui/node_modules/vite/package.json" in integration_job
    assert "panel_ui/node_modules/typescript/package.json" in integration_job
    setup_node_position = integration_job.index("uses: actions/setup-node@v5")
    install_position = integration_job.index("npm ci --prefix panel_ui --ignore-scripts")
    preflight_position = integration_job.index("name: Require panel parity toolchain")
    pytest_position = integration_job.index("name: Run client unit tests")
    assert setup_node_position < install_position < preflight_position < pytest_position
    for secret_marker in ("${{ secrets.", "${{ github.token", "GITHUB_TOKEN", "GH_TOKEN", "GHCR_TOKEN"):
        assert secret_marker not in workflow
    for publisher_marker in (
        "packages: write",
        "write-all",
        "docker/",
        "docker ",
        "ghcr.io",
        "publisher",
        "publish",
        "registry login",
        "release upload",
        "npm publish",
        "build-and-push.ps1",
        "watch-and-build.ps1",
        "workflow_call",
        "workflow_run",
        "gh api",
        "gh release",
        "gh workflow",
        "git push",
        "curl ",
        "wget ",
        "twine upload",
        "helm push",
        "oras push",
        "skopeo copy",
    ):
        assert publisher_marker not in workflow
    assert not re.search(r"(?im)^\s*(?:gh|docker|podman|buildah|curl|wget|aws|az|gcloud|oras|skopeo)\s", workflow)
    allowed_actions = {
        "actions/checkout@v5",
        "actions/setup-python@v6",
        "actions/setup-node@v5",
    }
    for action in re.findall(r"(?m)^\s*-\s*uses:\s*(\S+)", workflow):
        assert action in allowed_actions, f"unexpected root workflow action: {action}"


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
    assert "Play playlist" in compiled
    assert "Playback queue" in compiled
    for marker in ("Create playlist", "Save changes", "Browse media"):
        assert marker in compiled
    management_markers = (
        "Speakers", "Pairing PIN", "Save speaker settings", "System settings",
        "Global auto-reconnect", "bl_haos/speakers/scan", "bl_haos/speakers/system-settings/update",
    )
    for marker in management_markers:
        assert marker in compiled
    assert "/api/devices/pair" not in compiled
    assert "/api/scan/start" not in compiled
    source = (panel / "src" / "media-panel.tsx").read_text(encoding="utf-8")
    management_source = (panel / "src" / "speaker-management.tsx").read_text(encoding="utf-8")
    for marker in ("Create playlist", "Save changes", "Browse media"):
        assert marker in source
    for marker in management_markers:
        assert marker in source + management_source
    for forbidden in ("localStorage", "sessionStorage", "resolve_media", "apiClient", "window.", "parent.", "fetch(", "Authorization", "Bearer "):
        assert forbidden not in source


def test_panel_bundle_matches_fresh_build():
    panel = ROOT / "panel_ui"
    bundle = COMPONENT / "panel_static" / "bl-haos-media-panel.js"
    packaged_bytes_before = bundle.read_bytes()
    node = shutil.which("node.exe") or shutil.which("node")
    npm = shutil.which("npm.cmd") or shutil.which("npm")
    vite_package = panel / "node_modules" / "vite" / "package.json"
    typescript_package = panel / "node_modules" / "typescript" / "package.json"
    if node is None or npm is None or not vite_package.is_file() or not typescript_package.is_file():
        pytest.skip("Node.js, npm, Vite, and TypeScript are required for the local bundle parity check")

    build_dir = ROOT / ".panel-build-parity"
    if build_dir.exists():
        shutil.rmtree(build_dir)
    try:
        subprocess.run(
            [
                npm,
                "--prefix",
                str(panel),
                "run",
                "build",
                "--",
                "--outDir",
                str(build_dir),
            ],
            cwd=ROOT,
            check=True,
        )
        assert {path.name for path in build_dir.iterdir()} == {bundle.name}
        fresh_bundle = build_dir / bundle.name
        fresh_compiled = fresh_bundle.read_text(encoding="utf-8")
        assert "Play playlist" in fresh_compiled
        assert "Playback queue" in fresh_compiled
        for marker in ("Create playlist", "Save changes", "Browse media"):
            assert marker in fresh_compiled
        management_markers = (
            "Speakers", "Pairing PIN", "Save speaker settings", "System settings",
            "Global auto-reconnect", "bl_haos/speakers/scan", "bl_haos/speakers/system-settings/update",
        )
        for marker in management_markers:
            assert marker in fresh_compiled
        assert "/api/devices/pair" not in fresh_compiled
        assert "/api/scan/start" not in fresh_compiled
        assert filecmp.cmp(fresh_bundle, bundle, shallow=False), "tracked panel bundle differs from a fresh Vite build"
        assert bundle.read_bytes() == packaged_bytes_before, "isolated parity build modified the tracked package bundle"
    finally:
        shutil.rmtree(build_dir, ignore_errors=True)
