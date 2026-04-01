from __future__ import annotations

import hashlib
import os
import secrets
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4

import asyncpg

from .config import Settings
from .models import ApiKeyItem, CreateKeyResponse, TenantInfo, ValidateKeyResponse

_pool: Optional[asyncpg.Pool] = None


async def get_pool(settings: Settings) -> asyncpg.Pool:
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            settings.database_url,
            min_size=2,
            max_size=10,
            command_timeout=30,
        )
    return _pool


async def close_pool() -> None:
    global _pool
    if _pool:
        await _pool.close()
        _pool = None


# ── Schema migration (run once) ───────────────────────────────────────────────
# The api_keys table extends the existing Neon DB used by clawtrace-ui.
# It stores a SHA-256 hash of the key — the plaintext is never persisted.

CREATE_KEYS_TABLE = """
CREATE TABLE IF NOT EXISTS api_keys (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            TEXT        NOT NULL,
    key_hash        TEXT        NOT NULL UNIQUE,
    key_prefix      TEXT        NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_used_at    TIMESTAMPTZ,
    revoked         BOOLEAN     NOT NULL DEFAULT FALSE,
    revoked_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS api_keys_user_id_idx ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS api_keys_hash_idx    ON api_keys(key_hash);
"""


async def run_migrations(settings: Settings) -> None:
    pool = await get_pool(settings)
    async with pool.acquire() as conn:
        await conn.execute(CREATE_KEYS_TABLE)


# ── Key helpers ───────────────────────────────────────────────────────────────

def _generate_key(prefix: str) -> tuple[str, str, str]:
    """Returns (plaintext_key, key_hash, key_prefix_display)."""
    random_part = secrets.token_urlsafe(32)
    key = f"{prefix}_{random_part}"
    key_hash = hashlib.sha256(key.encode()).hexdigest()
    key_prefix = key[:24]
    return key, key_hash, key_prefix


def _hash_key(key: str) -> str:
    return hashlib.sha256(key.encode()).hexdigest()


# ── API key operations ────────────────────────────────────────────────────────

async def create_api_key(
    user_id: str, name: str, settings: Settings
) -> CreateKeyResponse:
    pool = await get_pool(settings)
    key, key_hash, key_prefix = _generate_key(settings.api_key_prefix)
    now = datetime.now(timezone.utc)

    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO api_keys (user_id, name, key_hash, key_prefix, created_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, created_at
            """,
            UUID(user_id), name, key_hash, key_prefix, now,
        )

    return CreateKeyResponse(
        id=row["id"],
        name=name,
        key=key,
        key_prefix=key_prefix,
        tenant_id=user_id,
        created_at=row["created_at"],
    )


async def list_api_keys(user_id: str, settings: Settings) -> list[ApiKeyItem]:
    pool = await get_pool(settings)
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT id, name, key_prefix, created_at, last_used_at, revoked
            FROM api_keys
            WHERE user_id = $1
            ORDER BY created_at DESC
            """,
            UUID(user_id),
        )
    return [
        ApiKeyItem(
            id=row["id"],
            name=row["name"],
            key_prefix=row["key_prefix"],
            tenant_id=user_id,
            created_at=row["created_at"],
            last_used_at=row["last_used_at"],
            revoked=row["revoked"],
        )
        for row in rows
    ]


async def revoke_api_key(
    key_id: str, user_id: str, settings: Settings
) -> bool:
    """Returns True if the key was found and revoked, False if not found."""
    pool = await get_pool(settings)
    now = datetime.now(timezone.utc)
    async with pool.acquire() as conn:
        result = await conn.execute(
            """
            UPDATE api_keys
            SET revoked = TRUE, revoked_at = $1
            WHERE id = $2 AND user_id = $3 AND revoked = FALSE
            """,
            now, UUID(key_id), UUID(user_id),
        )
    return result == "UPDATE 1"


async def get_tenant_info(user_id: str, settings: Settings) -> Optional[TenantInfo]:
    pool = await get_pool(settings)
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT name, email, avatar, tier, card_verified FROM users WHERE id = $1",
            UUID(user_id),
        )
        if not row:
            return None
        key_count = await conn.fetchval(
            "SELECT count(*) FROM api_keys WHERE user_id = $1 AND revoked = FALSE",
            UUID(user_id),
        )

    return TenantInfo(
        tenant_id=user_id,
        name=row["name"],
        email=row["email"],
        avatar=row["avatar"],
        tier=row["tier"],
        card_verified=row["card_verified"],
        key_count=int(key_count),
    )


# ── Internal: called by ingest service to validate observe keys ───────────────

async def validate_api_key(key: str, settings: Settings) -> ValidateKeyResponse:
    pool = await get_pool(settings)
    key_hash = _hash_key(key)
    now = datetime.now(timezone.utc)

    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT id, user_id FROM api_keys
            WHERE key_hash = $1 AND revoked = FALSE
            """,
            key_hash,
        )
        if not row:
            return ValidateKeyResponse(valid=False)

        # Update last_used_at asynchronously (fire and forget pattern)
        await conn.execute(
            "UPDATE api_keys SET last_used_at = $1 WHERE id = $2",
            now, row["id"],
        )

    return ValidateKeyResponse(
        valid=True,
        tenant_id=str(row["user_id"]),
        key_id=str(row["id"]),
    )
