from __future__ import annotations

import json
from uuid import uuid4

from fastapi.testclient import TestClient

from app.config import AuthMode, Settings
from app.main import create_app
from app.publisher import NoopPublisher
from app.service import IngestService
from app.storage import RawEventStorage


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


class FakeRawEventStorage(RawEventStorage):
    def __init__(self):
        self.rows: list[dict] = []

    def write_event(self, event):
        payload = event.model_dump(mode="json")
        self.rows.append(payload)
        return f"memory://raw/{payload['event']['eventId']}.jsonl"


def _client_with_fake_storage(*, auth_mode: AuthMode = AuthMode.MOCK_PASS, static_keys_json: str = "{}"):
    storage = FakeRawEventStorage()
    service = IngestService(storage=storage, publisher=NoopPublisher(), schema_version=1)
    settings = Settings(
        auth_mode=auth_mode,
        static_keys_json=static_keys_json,
        gcs_bucket="dummy-bucket-for-tests",
    )
    client = TestClient(create_app(settings, ingest_service=service))
    return client, storage


def test_ingest_accepts_event_with_mock_auth():
    client, storage = _client_with_fake_storage()

    response = client.post("/v1/traces/events", json=_payload())
    assert response.status_code == 200

    body = response.json()
    assert body["status"] == "accepted"
    assert body["duplicate"] is False
    assert body["rawObjectPath"]

    assert len(storage.rows) == 1
    parsed = json.loads(json.dumps(storage.rows[0]))
    assert parsed["accountId"] == "mock-account"


def test_ingest_rejects_invalid_static_key():
    client, _ = _client_with_fake_storage(
        auth_mode=AuthMode.STATIC_KEYS,
        static_keys_json='{"ct_live_good":"acct-1"}',
    )

    response = client.post(
        "/v1/traces/events",
        json=_payload(),
        headers={"Authorization": "Bearer ct_live_bad"},
    )
    assert response.status_code == 401


def test_ingest_accepts_repeated_event_without_local_dedup():
    client, _ = _client_with_fake_storage()

    payload = _payload()
    first = client.post("/v1/traces/events", json=payload)
    second = client.post("/v1/traces/events", json=payload)

    assert first.status_code == 200
    assert second.status_code == 200

    assert first.json()["status"] == "accepted"
    assert second.json()["status"] == "accepted"
    assert first.json()["duplicate"] is False
    assert second.json()["duplicate"] is False
