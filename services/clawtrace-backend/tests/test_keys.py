from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app
from app.models import ApiKeyItem, CreateKeyResponse, ValidateKeyResponse

TEST_SECRET   = "test-jwt-secret"
TEST_INTERNAL = "test-internal-secret"
TEST_USER_ID  = "77776f13-8c4e-4b34-9d6f-6a9c2b1d7e55"
TEST_KEY_ID   = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _make_token() -> str:
    header  = _b64url_encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    payload = _b64url_encode(json.dumps({
        "provider": "google", "id": "sub", "dbId": TEST_USER_ID,
        "name": "Richard", "avatar": "", "cardVerified": False,
        "iat": int(time.time()), "exp": int(time.time()) + 86400,
    }).encode())
    mac = hmac.new(TEST_SECRET.encode(), digestmod=hashlib.sha256)
    mac.update(f"{header}.{payload}".encode())
    sig = _b64url_encode(mac.digest())
    return f"{header}.{payload}.{sig}"


def _client() -> TestClient:
    settings = Settings(
        jwt_secret=TEST_SECRET,
        internal_secret=TEST_INTERNAL,
        database_url="",
    )
    return TestClient(create_app(settings))


def _auth_headers() -> dict:
    return {"Authorization": f"Bearer {_make_token()}"}


# ── POST /v1/keys ─────────────────────────────────────────────────────────────

def test_create_key_unauthenticated():
    r = _client().post("/v1/keys", json={"name": "my key"})
    assert r.status_code == 401


def test_create_key_success():
    from datetime import datetime, timezone
    from uuid import UUID

    import base64
    import json as _json

    _observe = base64.urlsafe_b64encode(
        _json.dumps({"apiKey": "ct_live_abc123", "tenantId": TEST_USER_ID, "agentId": TEST_KEY_ID}).encode()
    ).rstrip(b"=").decode()

    mock_response = CreateKeyResponse(
        id=UUID(TEST_KEY_ID),
        name="my key",
        key="ct_live_abc123",
        key_prefix="ct_live_abc123456789",
        tenant_id=TEST_USER_ID,
        created_at=datetime.now(timezone.utc),
        observe_key=_observe,
    )

    with patch("app.routers.keys.create_api_key", new=AsyncMock(return_value=mock_response)):
        r = _client().post("/v1/keys", json={"name": "my key"}, headers=_auth_headers())

    assert r.status_code == 201
    data = r.json()
    assert data["key"].startswith("ct_live_")
    assert data["tenant_id"] == TEST_USER_ID
    assert "key" in data          # plaintext returned once
    assert "observe_key" in data  # encoded bundle returned once


def test_create_key_empty_name():
    r = _client().post("/v1/keys", json={"name": ""}, headers=_auth_headers())
    assert r.status_code == 422


# ── GET /v1/keys ──────────────────────────────────────────────────────────────

def test_list_keys_unauthenticated():
    r = _client().get("/v1/keys")
    assert r.status_code == 401


def test_list_keys_success():
    from datetime import datetime, timezone
    from uuid import UUID

    mock_keys = [
        ApiKeyItem(
            id=UUID(TEST_KEY_ID),
            name="my key",
            key_prefix="ct_live_abc",
            tenant_id=TEST_USER_ID,
            created_at=datetime.now(timezone.utc),
            revoked=False,
        )
    ]

    with patch("app.routers.keys.list_api_keys", new=AsyncMock(return_value=mock_keys)):
        r = _client().get("/v1/keys", headers=_auth_headers())

    assert r.status_code == 200
    assert len(r.json()["keys"]) == 1
    assert "key" not in r.json()["keys"][0]  # plaintext never in list


# ── DELETE /v1/keys/{id} ──────────────────────────────────────────────────────

def test_revoke_key_not_found():
    with patch("app.routers.keys.revoke_api_key", new=AsyncMock(return_value=False)):
        r = _client().delete(f"/v1/keys/{TEST_KEY_ID}", headers=_auth_headers())
    assert r.status_code == 404


def test_revoke_key_success():
    with patch("app.routers.keys.revoke_api_key", new=AsyncMock(return_value=True)):
        r = _client().delete(f"/v1/keys/{TEST_KEY_ID}", headers=_auth_headers())
    assert r.status_code == 204


# ── POST /v1/keys/validate (internal) ────────────────────────────────────────

def test_validate_no_internal_secret():
    r = _client().post("/v1/keys/validate", json={"api_key": "ct_live_xyz"})
    assert r.status_code == 403


def test_validate_wrong_internal_secret():
    r = _client().post(
        "/v1/keys/validate",
        json={"api_key": "ct_live_xyz"},
        headers={"x-internal-secret": "wrong"},
    )
    assert r.status_code == 403


def test_validate_invalid_key():
    mock = AsyncMock(return_value=ValidateKeyResponse(valid=False))
    with patch("app.routers.keys.validate_api_key", new=mock):
        r = _client().post(
            "/v1/keys/validate",
            json={"api_key": "ct_live_unknown"},
            headers={"x-internal-secret": TEST_INTERNAL},
        )
    assert r.status_code == 200
    assert r.json()["valid"] is False


def test_validate_valid_key():
    mock = AsyncMock(return_value=ValidateKeyResponse(
        valid=True, tenant_id=TEST_USER_ID, key_id=TEST_KEY_ID
    ))
    with patch("app.routers.keys.validate_api_key", new=mock):
        r = _client().post(
            "/v1/keys/validate",
            json={"api_key": "ct_live_realkey"},
            headers={"x-internal-secret": TEST_INTERNAL},
        )
    assert r.status_code == 200
    data = r.json()
    assert data["valid"] is True
    assert data["tenant_id"] == TEST_USER_ID
