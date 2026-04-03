from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch
from uuid import UUID

import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.database import _decode_observe_key, _encode_observe_key
from app.main import create_app
from app.models import AgentItem, CreateKeyResponse

TEST_SECRET   = "test-jwt-secret"
TEST_INTERNAL = "test-internal-secret"
TEST_USER_ID  = "77776f13-8c4e-4b34-9d6f-6a9c2b1d7e55"
TEST_KEY_ID   = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
TEST_RAW_KEY  = "ct_live_testrawapikey"


# ── Helpers ───────────────────────────────────────────────────────────────────

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


def _make_agent(name: str = "my agent") -> AgentItem:
    return AgentItem(
        id=UUID(TEST_KEY_ID),
        name=name,
        key_prefix="ct_live_abc",
        tenant_id=TEST_USER_ID,
        created_at=datetime.now(timezone.utc),
        last_used_at=None,
    )


# ── Unit tests: observe key encoding ─────────────────────────────────────────

def test_encode_observe_key_roundtrip():
    encoded = _encode_observe_key(TEST_RAW_KEY, TEST_USER_ID, TEST_KEY_ID)
    # Must be a non-empty string with no padding characters
    assert isinstance(encoded, str)
    assert "=" not in encoded

    decoded = _decode_observe_key(encoded)
    assert decoded is not None
    assert decoded["apiKey"] == TEST_RAW_KEY
    assert decoded["tenantId"] == TEST_USER_ID
    assert decoded["agentId"] == TEST_KEY_ID


def test_decode_observe_key_returns_none_for_raw_key():
    # A raw key starting with ct_live_ is not valid base64url JSON
    result = _decode_observe_key(TEST_RAW_KEY)
    assert result is None


def test_decode_observe_key_returns_none_for_garbage():
    assert _decode_observe_key("not-valid!!!") is None


def test_decode_observe_key_returns_none_for_json_without_apikey():
    payload = base64.urlsafe_b64encode(json.dumps({"foo": "bar"}).encode()).decode().rstrip("=")
    assert _decode_observe_key(payload) is None


def test_encode_observe_key_structure():
    """The encoded payload must contain all three fields."""
    encoded = _encode_observe_key(TEST_RAW_KEY, TEST_USER_ID, TEST_KEY_ID)
    pad = 4 - len(encoded) % 4
    padded = encoded + ("=" * pad if pad != 4 else "")
    payload = json.loads(base64.urlsafe_b64decode(padded))
    assert set(payload.keys()) == {"apiKey", "tenantId", "agentId"}


# ── GET /v1/agents ────────────────────────────────────────────────────────────

def test_list_agents_unauthenticated():
    r = _client().get("/v1/agents")
    assert r.status_code == 401


def test_list_agents_empty():
    with patch("app.routers.agents.list_agents", new=AsyncMock(return_value=[])):
        r = _client().get("/v1/agents", headers=_auth_headers())
    assert r.status_code == 200
    assert r.json()["agents"] == []


def test_list_agents_success():
    mock_agents = [_make_agent("agent one"), _make_agent("agent two")]
    with patch("app.routers.agents.list_agents", new=AsyncMock(return_value=mock_agents)):
        r = _client().get("/v1/agents", headers=_auth_headers())
    assert r.status_code == 200
    data = r.json()
    assert len(data["agents"]) == 2
    assert data["agents"][0]["name"] == "agent one"
    # Sensitive fields must not be present
    assert "key" not in data["agents"][0]
    assert "key_hash" not in data["agents"][0]


# ── PATCH /v1/agents/{agent_id} ───────────────────────────────────────────────

def test_rename_agent_unauthenticated():
    r = _client().patch(f"/v1/agents/{TEST_KEY_ID}", json={"name": "new name"})
    assert r.status_code == 401


def test_rename_agent_not_found():
    with patch("app.routers.agents.rename_agent", new=AsyncMock(return_value=False)):
        r = _client().patch(
            f"/v1/agents/{TEST_KEY_ID}",
            json={"name": "new name"},
            headers=_auth_headers(),
        )
    assert r.status_code == 404


def test_rename_agent_success():
    updated_agent = _make_agent("new name")
    with patch("app.routers.agents.rename_agent", new=AsyncMock(return_value=True)), \
         patch("app.routers.agents.list_agents", new=AsyncMock(return_value=[updated_agent])):
        r = _client().patch(
            f"/v1/agents/{TEST_KEY_ID}",
            json={"name": "new name"},
            headers=_auth_headers(),
        )
    assert r.status_code == 200
    assert r.json()["name"] == "new name"
    assert r.json()["id"] == TEST_KEY_ID


def test_rename_agent_empty_name():
    r = _client().patch(
        f"/v1/agents/{TEST_KEY_ID}",
        json={"name": ""},
        headers=_auth_headers(),
    )
    assert r.status_code == 422


# ── DELETE /v1/agents/{agent_id} ─────────────────────────────────────────────

def test_delete_agent_unauthenticated():
    r = _client().delete(f"/v1/agents/{TEST_KEY_ID}")
    assert r.status_code == 401


def test_delete_agent_not_found():
    with patch("app.routers.agents.delete_agent", new=AsyncMock(return_value=False)):
        r = _client().delete(f"/v1/agents/{TEST_KEY_ID}", headers=_auth_headers())
    assert r.status_code == 404


def test_delete_agent_success():
    with patch("app.routers.agents.delete_agent", new=AsyncMock(return_value=True)):
        r = _client().delete(f"/v1/agents/{TEST_KEY_ID}", headers=_auth_headers())
    assert r.status_code == 204


# ── POST /v1/keys — observe_key in response ───────────────────────────────────

def test_create_key_returns_observe_key():
    """The create key response must include observe_key."""
    observe_key = _encode_observe_key(TEST_RAW_KEY, TEST_USER_ID, TEST_KEY_ID)
    mock_response = CreateKeyResponse(
        id=UUID(TEST_KEY_ID),
        name="my key",
        key=TEST_RAW_KEY,
        key_prefix="ct_live_testrawapikey",
        tenant_id=TEST_USER_ID,
        created_at=datetime.now(timezone.utc),
        observe_key=observe_key,
    )
    with patch("app.routers.keys.create_api_key", new=AsyncMock(return_value=mock_response)):
        r = _client().post("/v1/keys", json={"name": "my key"}, headers=_auth_headers())
    assert r.status_code == 201
    data = r.json()
    assert "observe_key" in data
    assert data["observe_key"] == observe_key
    # Decode and verify structure
    decoded = _decode_observe_key(data["observe_key"])
    assert decoded is not None
    assert decoded["apiKey"] == TEST_RAW_KEY
    assert decoded["tenantId"] == TEST_USER_ID
    assert decoded["agentId"] == TEST_KEY_ID


# ── POST /v1/keys/validate — encoded observe key ─────────────────────────────

def test_validate_encoded_observe_key():
    """validate endpoint must accept an encoded observe key."""
    from app.models import ValidateKeyResponse

    observe_key = _encode_observe_key(TEST_RAW_KEY, TEST_USER_ID, TEST_KEY_ID)
    mock = AsyncMock(return_value=ValidateKeyResponse(
        valid=True, tenant_id=TEST_USER_ID, key_id=TEST_KEY_ID
    ))
    with patch("app.routers.keys.validate_api_key", new=mock):
        r = _client().post(
            "/v1/keys/validate",
            json={"api_key": observe_key},
            headers={"x-internal-secret": TEST_INTERNAL},
        )
    assert r.status_code == 200
    data = r.json()
    assert data["valid"] is True
    assert data["tenant_id"] == TEST_USER_ID
    # validate_api_key was called with the encoded key — decoding is its responsibility
    mock.assert_awaited_once()
    call_key_arg = mock.call_args[0][0]
    assert call_key_arg == observe_key


def test_validate_raw_key_still_works():
    """Existing raw key format must still be accepted."""
    from app.models import ValidateKeyResponse

    mock = AsyncMock(return_value=ValidateKeyResponse(
        valid=True, tenant_id=TEST_USER_ID, key_id=TEST_KEY_ID
    ))
    with patch("app.routers.keys.validate_api_key", new=mock):
        r = _client().post(
            "/v1/keys/validate",
            json={"api_key": TEST_RAW_KEY},
            headers={"x-internal-secret": TEST_INTERNAL},
        )
    assert r.status_code == 200
    assert r.json()["valid"] is True
