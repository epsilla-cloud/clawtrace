from __future__ import annotations

from dataclasses import dataclass

import httpx
from fastapi import HTTPException, status

from .config import AuthMode, Settings
from .models import AuthContext


@dataclass
class ParsedBearer:
    token: str


def parse_bearer_token(authorization: str | None) -> ParsedBearer | None:
    if not authorization:
        return None
    parts = authorization.strip().split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer" or not parts[1].strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header. Expected Bearer token.",
        )
    return ParsedBearer(token=parts[1].strip())


def authenticate(settings: Settings, authorization: str | None) -> AuthContext:
    bearer = parse_bearer_token(authorization)

    if settings.auth_mode == AuthMode.MOCK_PASS:
        token = bearer.token if bearer else "mock-pass-key"
        return AuthContext(accountId="mock-account", apiKeyId=token[:16])

    if settings.auth_mode == AuthMode.STATIC_KEYS:
        if not bearer:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing Authorization bearer token.",
            )
        account_id = settings.static_keys.get(bearer.token)
        if not account_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API key.",
            )
        return AuthContext(accountId=account_id, apiKeyId=bearer.token[:16])

    if settings.auth_mode == AuthMode.REMOTE_API:
        if not bearer:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing Authorization bearer token.",
            )
        return _validate_remote(settings, bearer.token)

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"Unsupported auth mode: {settings.auth_mode}",
    )


def _validate_remote(settings: Settings, token: str) -> AuthContext:
    """Call the backend's internal key-validation endpoint synchronously."""
    if not settings.internal_secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="CLAWTRACE_INGEST_INTERNAL_SECRET is not configured.",
        )

    url = f"{settings.backend_url.rstrip('/')}/v1/keys/validate"
    try:
        resp = httpx.post(
            url,
            json={"api_key": token},
            headers={"x-internal-secret": settings.internal_secret},
            timeout=5.0,
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Auth service unreachable: {exc}",
        )

    if resp.status_code == 403:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal secret rejected by auth service.",
        )

    if resp.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Auth service returned unexpected status {resp.status_code}.",
        )

    data = resp.json()
    if not data.get("valid"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or revoked API key.",
        )

    tenant_id = data.get("tenant_id") or ""
    key_id = data.get("key_id") or token[:16]
    return AuthContext(accountId=tenant_id, apiKeyId=key_id[:16])
