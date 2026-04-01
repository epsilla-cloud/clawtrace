from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time

import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app

TEST_SECRET = "test-jwt-secret"
TEST_USER_ID = "77776f13-8c4e-4b34-9d6f-6a9c2b1d7e55"


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _make_jwt(payload: dict, secret: str = TEST_SECRET) -> str:
    header = _b64url_encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    body   = _b64url_encode(json.dumps(payload).encode())
    mac = hmac.new(secret.encode(), digestmod=hashlib.sha256)
    mac.update(f"{header}.{body}".encode())
    sig = _b64url_encode(mac.digest())
    return f"{header}.{body}.{sig}"


def _valid_token(user_id: str = TEST_USER_ID) -> str:
    return _make_jwt({
        "provider": "google",
        "id": "google-sub-123",
        "dbId": user_id,
        "name": "Richard",
        "avatar": "",
        "email": "richard@epsilla.com",
        "cardVerified": False,
        "iat": int(time.time()),
        "exp": int(time.time()) + 86400,
    })


def _client() -> TestClient:
    settings = Settings(jwt_secret=TEST_SECRET, database_url="")
    return TestClient(create_app(settings))


# ── /v1/auth/me ───────────────────────────────────────────────────────────────

def test_me_no_token():
    r = _client().get("/v1/auth/me")
    assert r.status_code == 401


def test_me_invalid_token():
    r = _client().get("/v1/auth/me", headers={"Authorization": "Bearer bad.token.here"})
    assert r.status_code == 401


def test_me_expired_token():
    token = _make_jwt({
        "provider": "google", "id": "x", "dbId": TEST_USER_ID,
        "name": "X", "avatar": "", "cardVerified": False,
        "iat": int(time.time()) - 90000,
        "exp": int(time.time()) - 3600,   # expired 1h ago
    })
    r = _client().get("/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 401


def test_me_wrong_secret():
    token = _make_jwt(
        {"provider": "google", "id": "x", "dbId": TEST_USER_ID,
         "name": "X", "avatar": "", "cardVerified": False,
         "iat": int(time.time()), "exp": int(time.time()) + 86400},
        secret="wrong-secret",
    )
    r = _client().get("/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 401


def test_me_valid_bearer():
    token = _valid_token()
    r = _client().get("/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    data = r.json()
    assert data["db_id"] == TEST_USER_ID
    assert data["email"] == "richard@epsilla.com"
    assert data["provider"] == "google"


def test_me_valid_cookie():
    token = _valid_token()
    client = _client()
    client.cookies.set("auth_token", token)
    r = client.get("/v1/auth/me")
    assert r.status_code == 200
    assert r.json()["db_id"] == TEST_USER_ID


def test_tenant_id_equals_db_id():
    """db_id in the JWT IS the tenant_id — critical for silver layer partitioning."""
    token = _valid_token()
    r = _client().get("/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.json()["db_id"] == TEST_USER_ID


# ── /healthz ──────────────────────────────────────────────────────────────────

def test_healthz():
    r = _client().get("/healthz")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"
