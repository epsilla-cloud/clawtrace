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
        raw_bucket="dummy-bucket-for-tests",
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


def test_ingest_uses_tenant_header_when_static_key_maps_placeholder():
    client, storage = _client_with_fake_storage(
        auth_mode=AuthMode.STATIC_KEYS,
        static_keys_json='{"ct_live_good":"tenant_demo"}',
    )
    tenant_id = "6e6d1cc9-2118-4d59-86b0-21f2a5f8cc99"

    response = client.post(
        "/v1/traces/events",
        json=_payload(),
        headers={
            "Authorization": "Bearer ct_live_good",
            "x-clawtrace-tenant-id": tenant_id,
        },
    )
    assert response.status_code == 200
    assert len(storage.rows) == 1
    assert storage.rows[0]["accountId"] == tenant_id


def test_ingest_rejects_invalid_tenant_header():
    client, _ = _client_with_fake_storage(
        auth_mode=AuthMode.STATIC_KEYS,
        static_keys_json='{"ct_live_good":"tenant_demo"}',
    )

    response = client.post(
        "/v1/traces/events",
        json=_payload(),
        headers={
            "Authorization": "Bearer ct_live_good",
            "x-clawtrace-tenant-id": "not-a-uuid",
        },
    )
    assert response.status_code == 422
    assert response.json()["detail"]["error"] == "invalid_tenant_id"


def test_ingest_rejects_tenant_mismatch_when_key_maps_uuid():
    mapped_tenant = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"
    client, _ = _client_with_fake_storage(
        auth_mode=AuthMode.STATIC_KEYS,
        static_keys_json=f'{{"ct_live_good":"{mapped_tenant}"}}',
    )

    response = client.post(
        "/v1/traces/events",
        json=_payload(),
        headers={
            "Authorization": "Bearer ct_live_good",
            "x-clawtrace-tenant-id": "6e6d1cc9-2118-4d59-86b0-21f2a5f8cc99",
        },
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Tenant mismatch for API key."


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


def test_ingest_parses_stringified_payload():
    client, storage = _client_with_fake_storage()
    payload = _payload()
    payload["event"]["payload"] = '{"name":"double-encoded"}'

    response = client.post("/v1/traces/events", json=payload)
    assert response.status_code == 200
    stored_payload = storage.rows[0]["event"]["payload"]
    assert stored_payload == {"name": "double-encoded"}


def test_ingest_rejects_non_object_stringified_payload():
    client, _ = _client_with_fake_storage()
    payload = _payload()
    payload["event"]["payload"] = '["not", "an", "object"]'

    response = client.post("/v1/traces/events", json=payload)
    assert response.status_code == 422


def test_ingest_rejects_invalid_json_string_payload():
    client, _ = _client_with_fake_storage()
    payload = _payload()
    payload["event"]["payload"] = "not-json"

    response = client.post("/v1/traces/events", json=payload)
    assert response.status_code == 422
