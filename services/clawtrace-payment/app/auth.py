"""JWT verification — mirrors clawtrace-backend/app/auth.py exactly."""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
from typing import Optional

from fastapi import Cookie, Depends, Header, HTTPException, status
from pydantic import BaseModel

from .config import Settings


class UserSession(BaseModel):
    provider: str
    id: str
    db_id: str
    name: str
    avatar: str = ""
    email: Optional[str] = None
    card_verified: bool = False


def _b64url_decode(s: str) -> bytes:
    pad = 4 - len(s) % 4
    if pad != 4:
        s += "=" * pad
    return base64.urlsafe_b64decode(s)


def _verify_jwt(token: str, secret: str) -> dict:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            raise ValueError("malformed JWT")
        header_b64, payload_b64, sig_b64 = parts
        signing_input = f"{header_b64}.{payload_b64}".encode()
        mac = hmac.new(secret.encode(), digestmod=hashlib.sha256)
        mac.update(signing_input)
        expected_sig = mac.digest()
        actual_sig = _b64url_decode(sig_b64)
        if not hmac.compare_digest(expected_sig, actual_sig):
            raise ValueError("invalid signature")
        payload = json.loads(_b64url_decode(payload_b64))
        if payload.get("exp", 0) < time.time():
            raise ValueError("token expired")
        return payload
    except (ValueError, KeyError, json.JSONDecodeError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"invalid token: {exc}",
        )


def _payload_to_session(payload: dict) -> UserSession:
    return UserSession(
        provider=payload["provider"],
        id=payload["id"],
        db_id=payload["dbId"],
        name=payload["name"],
        avatar=payload.get("avatar", ""),
        email=payload.get("email"),
        card_verified=payload.get("cardVerified", False),
    )


# ── FastAPI dependencies ──────────────────────────────────────────────────

_settings_singleton: Settings | None = None


def _get_settings() -> Settings:
    global _settings_singleton
    if _settings_singleton is None:
        _settings_singleton = Settings()
    return _settings_singleton


def get_settings() -> Settings:
    return _get_settings()


def get_current_user(
    auth_token: Optional[str] = Cookie(default=None),
    authorization: Optional[str] = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> UserSession:
    token: Optional[str] = None
    if auth_token:
        token = auth_token
    elif authorization and authorization.startswith("Bearer "):
        token = authorization[7:]
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="authentication required",
        )
    payload = _verify_jwt(token, settings.jwt_secret)
    return _payload_to_session(payload)


def require_internal(
    x_internal_secret: Optional[str] = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> None:
    if not x_internal_secret or not hmac.compare_digest(
        x_internal_secret, settings.internal_secret
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="internal secret required",
        )
