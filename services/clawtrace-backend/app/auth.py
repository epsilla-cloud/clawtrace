from __future__ import annotations

import hmac
import hashlib
import base64
import json
import time

from fastapi import Cookie, Depends, Header, HTTPException, status
from typing import Optional

from .config import Settings
from .models import UserSession

# ── JWT helpers matching clawtrace-ui's custom HMAC-SHA256 implementation ─────
# The UI does NOT use a standard JWT library — it manually base64-encodes
# header.payload.signature using Node's crypto.createHmac('sha256', secret).
# We mirror that exact algorithm here.


def _b64url_decode(s: str) -> bytes:
    pad = 4 - len(s) % 4
    if pad != 4:
        s += "=" * pad
    return base64.urlsafe_b64decode(s)


def _verify_jwt(token: str, secret: str) -> dict:
    """Verify a clawtrace-ui JWT and return the payload dict."""
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
    """Map JWT payload fields to UserSession.
    The UI signs: { provider, id, dbId, name, avatar, email?, cardVerified, iat, exp }
    """
    return UserSession(
        provider=payload["provider"],
        id=payload["id"],
        db_id=payload["dbId"],
        name=payload["name"],
        avatar=payload.get("avatar", ""),
        email=payload.get("email"),
        card_verified=payload.get("cardVerified", False),
    )


# ── FastAPI dependencies ───────────────────────────────────────────────────────

def get_settings() -> Settings:
    return Settings()


def get_current_user(
    auth_token: Optional[str] = Cookie(default=None),
    authorization: Optional[str] = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> UserSession:
    """Extract and validate the auth_token from cookie or Bearer header.
    Returns the decoded UserSession; raises 401 if missing or invalid.
    """
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
    """Guard for internal-only endpoints called by the ingest service."""
    if not x_internal_secret or not hmac.compare_digest(
        x_internal_secret, settings.internal_secret
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="internal secret required",
        )
