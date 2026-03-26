from __future__ import annotations

import json
from pathlib import Path
from uuid import uuid4

from fastapi.testclient import TestClient

from app.config import AuthMode, Settings
from app.main import create_app


def _payload() -> dict:
    return {
        "schemaVersion": 1,
        "agentId": str(uuid4()),
        "event": {
            "eventId": str(uuid4()),
            "eventType": "span_start",
            "traceId": "trace-1",
            "spanId": "span-1",
            "parentSpanId": None,
            "tsMs": 1764064800000,
            "payload": {"name": "demo"},
        },
    }


def test_ingest_accepts_event_with_mock_auth(tmp_path: Path):
    settings = Settings(
        raw_sink="local",
        local_data_root=tmp_path / "raw",
        enable_idempotency=True,
        idempotency_db_path=tmp_path / "idem.sqlite3",
    )
    client = TestClient(create_app(settings))

    response = client.post("/v1/traces/events", json=_payload())
    assert response.status_code == 200

    body = response.json()
    assert body["status"] == "accepted"
    assert body["duplicate"] is False
    assert body["rawObjectPath"]

    files = list((tmp_path / "raw").rglob("*.jsonl"))
    assert len(files) == 1

    line = files[0].read_text(encoding="utf-8").strip()
    parsed = json.loads(line)
    assert parsed["accountId"] == "mock-account"


def test_ingest_rejects_invalid_static_key(tmp_path: Path):
    settings = Settings(
        auth_mode=AuthMode.STATIC_KEYS,
        static_keys_json='{"ct_live_good":"acct-1"}',
        raw_sink="local",
        local_data_root=tmp_path / "raw",
        enable_idempotency=False,
    )
    client = TestClient(create_app(settings))

    response = client.post(
        "/v1/traces/events",
        json=_payload(),
        headers={"Authorization": "Bearer ct_live_bad"},
    )
    assert response.status_code == 401


def test_ingest_deduplicates_by_agent_and_event_id(tmp_path: Path):
    settings = Settings(
        raw_sink="local",
        local_data_root=tmp_path / "raw",
        enable_idempotency=True,
        idempotency_db_path=tmp_path / "idem.sqlite3",
    )
    client = TestClient(create_app(settings))

    payload = _payload()
    first = client.post("/v1/traces/events", json=payload)
    second = client.post("/v1/traces/events", json=payload)

    assert first.status_code == 200
    assert second.status_code == 200

    assert first.json()["status"] == "accepted"
    assert second.json()["status"] == "duplicate"
    assert second.json()["duplicate"] is True
