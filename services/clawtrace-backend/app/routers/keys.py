from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from ..auth import get_current_user, get_settings, require_internal
from ..config import Settings
from ..database import create_api_key, list_api_keys, revoke_api_key, validate_api_key
from ..models import (
    ApiKeyListResponse,
    CreateKeyRequest,
    CreateKeyResponse,
    UserSession,
    ValidateKeyRequest,
    ValidateKeyResponse,
)

router = APIRouter(prefix="/v1/keys", tags=["keys"])


@router.post("", response_model=CreateKeyResponse, status_code=201)
async def create_key(
    body: CreateKeyRequest,
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
) -> CreateKeyResponse:
    """Create a new observe key for the authenticated tenant.
    The plaintext key and the base64url-encoded observe_key are returned ONCE — store them securely.
    Pass the observe_key directly to the OpenClaw plugin; it bundles tenant + agent metadata.
    """
    return await create_api_key(session.db_id, body.name, settings)


@router.get("", response_model=ApiKeyListResponse)
async def list_keys(
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
) -> ApiKeyListResponse:
    """List all observe keys for the authenticated tenant.
    Keys are shown with only their prefix — the plaintext is never stored.
    """
    keys = await list_api_keys(session.db_id, settings)
    return ApiKeyListResponse(keys=keys)


@router.delete("/{key_id}", status_code=204)
async def revoke_key(
    key_id: str,
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
) -> None:
    """Revoke an observe key. The ingest service will reject it immediately."""
    revoked = await revoke_api_key(key_id, session.db_id, settings)
    if not revoked:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="key not found or already revoked",
        )


# ── Internal endpoint — called by clawtrace-ingest to validate observe keys ───

@router.post("/validate", response_model=ValidateKeyResponse, include_in_schema=False)
async def validate_key(
    body: ValidateKeyRequest,
    _: None = Depends(require_internal),
    settings: Settings = Depends(get_settings),
) -> ValidateKeyResponse:
    """Internal endpoint for the ingest service to validate an observe key.
    Accepts both raw API keys (ct_live_xxx) and base64url-encoded observe keys.
    Returns the tenant_id if valid so ingest can partition data correctly.
    Not exposed in the public OpenAPI schema.
    """
    return await validate_api_key(body.api_key, settings)
