import re
from pathlib import Path


def test_phase25_library_docs():
    readme = (Path(__file__).parents[1] / "README.md").read_text(encoding="utf-8")
    text = " ".join(readme.lower().split())

    assert "local phase 25 candidate" in text
    assert "ordered home assistant media references" in text
    assert "one-reference provider-playlist shortcuts" in text
    assert "provider tracks are not copied" in text
    assert "they do not resolve or play media" in text
    assert "t-24-15 remains open/high" in text
    assert "t-24-16 remains open/medium" in text
    assert "release and deployment are not approved" in text
    assert "phase 26 local queue candidate" in text
    assert not re.search(r"saved playlist crud is deferred to phase 25", text)
    for unsupported_claim in ("production acceptance complete", "release approved", "deployment approved"):
        assert unsupported_claim not in text