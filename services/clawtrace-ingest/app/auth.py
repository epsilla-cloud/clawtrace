from __future__ import annotations

from dataclasses import dataclass

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

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"Unsupported auth mode: {settings.auth_mode}",
    )
