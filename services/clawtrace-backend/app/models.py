from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


# ── JWT session (mirrors clawtrace-ui JWT payload) ────────────────────────────

class UserSession(BaseModel):
    """Decoded payload from the clawtrace-ui auth_token JWT.
    db_id is the user's UUID in Neon — this IS the tenant_id in the silver layer.
    """
    provider: str
    id: str           # OAuth provider's user ID (Google sub / GitHub id)
    db_id: str        # users.id UUID — maps 1:1 to tenant_id in silver tables
    name: str
    avatar: str
    email: Optional[str] = None
    card_verified: bool = False


# ── API key models ─────────────────────────────────────────────────────────────

class CreateKeyRequest(BaseModel):
    name: str = Field(min_length=1, max_length=80, description="Human-readable label")


class CreateKeyResponse(BaseModel):
    """Returned once on creation — plaintext key is never stored or returned again."""
    id: UUID
    name: str
    key: str          # full plaintext key — show once, then discard
    key_prefix: str   # first 20 chars for display in key list
    tenant_id: str    # = user.db_id
    created_at: datetime


class ApiKeyItem(BaseModel):
    """Safe representation for key list — no plaintext, no hash."""
    id: UUID
    name: str
    key_prefix: str
    tenant_id: str
    created_at: datetime
    last_used_at: Optional[datetime] = None
    revoked: bool


class ApiKeyListResponse(BaseModel):
    keys: list[ApiKeyItem]


# ── Tenant info ────────────────────────────────────────────────────────────────

class TenantInfo(BaseModel):
    tenant_id: str    # = user.db_id UUID
    name: str
    email: Optional[str]
    avatar: str
    tier: str
    card_verified: bool
    key_count: int


# ── Internal key validation (called by ingest service) ────────────────────────

class ValidateKeyRequest(BaseModel):
    api_key: str


class ValidateKeyResponse(BaseModel):
    valid: bool
    tenant_id: Optional[str] = None
    key_id: Optional[str] = None


# ── Healthz ────────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str = "ok"
