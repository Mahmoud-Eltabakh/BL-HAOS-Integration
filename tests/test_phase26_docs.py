import re
from pathlib import Path


def test_phase26_queue_integration_docs_match_ha_resolution_and_capability_contract():
    text = " ".join((Path(__file__).parents[1] / "README.md").read_text(encoding="utf-8").lower().split())

    assert "home assistant resolves every saved reference in order before submitting one queue start" in text
    assert "provider shortcuts remain one atomic queue item" in text
    assert "native queue controls require bridge queue version 1" in text
    assert "queue start, next, and previous are not automatically retried" in text
    assert "resolved playback urls are transient between home assistant and the bridge" in text
    assert "queues do not resume after an add-on restart" in text
    assert "local sil and mock evidence do not establish live provider or audible playback acceptance" in text
    for unsupported_claim in ("production acceptance complete", "release approved", "deployment approved"):
        assert unsupported_claim not in text