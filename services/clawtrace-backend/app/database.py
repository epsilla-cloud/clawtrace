from __future__ import annotations

import base64
import hashlib
import json
import os
import secrets
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4

import asyncpg

from .config import Settings
from .models import AgentItem, ApiKeyItem, CreateKeyResponse, TenantInfo, ValidateKeyResponse

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


CREATE_TRACY_TABLES = """
CREATE TABLE IF NOT EXISTS tracy_sessions (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    harness_session_id  TEXT        NOT NULL,
    page_scope          TEXT,            -- 'agent_dashboard', 'trace_detail', 'general'
    agent_id            TEXT,            -- set when on agent dashboard
    trace_id            TEXT,            -- set when on trace detail
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tracy_sessions_user_idx ON tracy_sessions(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tracy_messages (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id          UUID        NOT NULL REFERENCES tracy_sessions(id) ON DELETE CASCADE,
    role                TEXT        NOT NULL,    -- 'user' or 'assistant'
    raw_message         TEXT,                    -- user's original question
    context_message     TEXT,                    -- forged message with <context> block
    response_text       TEXT,                    -- assistant's final text response
    reasoning_steps     JSONB,                   -- [{type, data}] intermediate events
    input_tokens        INT,
    output_tokens       INT,
    metadata            JSONB,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tracy_messages_session_idx ON tracy_messages(session_id, created_at);
"""


async def run_migrations(settings: Settings) -> None:
    pool = await get_pool(settings)
    async with pool.acquire() as conn:
        await conn.execute(CREATE_KEYS_TABLE)
        await conn.execute(CREATE_TRACY_TABLES)


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


def _encode_observe_key(api_key: str, tenant_id: str, agent_id: str) -> str:
    """Return a base64url-encoded JSON bundle for use as an observe key."""
    payload = json.dumps(
        {"apiKey": api_key, "tenantId": tenant_id, "agentId": agent_id},
        separators=(",", ":"),
    ).encode()
    return base64.urlsafe_b64encode(payload).rstrip(b"=").decode()


def _decode_observe_key(observe_key: str) -> Optional[dict]:
    """Decode a base64url observe key. Returns None if the input is not an encoded key."""
    try:
        pad = 4 - len(observe_key) % 4
        padded = observe_key + ("=" * pad if pad != 4 else "")
        payload = json.loads(base64.urlsafe_b64decode(padded))
        if isinstance(payload, dict) and "apiKey" in payload:
            return payload
    except Exception:
        pass
    return None


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

    key_id = str(row["id"])
    observe_key = _encode_observe_key(key, user_id, key_id)

    return CreateKeyResponse(
        id=row["id"],
        name=name,
        key=key,
        key_prefix=key_prefix,
        tenant_id=user_id,
        created_at=row["created_at"],
        observe_key=observe_key,
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
    """Validate a raw API key OR a base64url-encoded observe key.

    Encoded observe keys are decoded to extract the raw apiKey, which is then
    validated the same way as a direct raw key submission.
    """
    pool = await get_pool(settings)

    # Attempt to decode as an observe key first; fall back to treating as raw key.
    decoded = _decode_observe_key(key)
    raw_key = decoded["apiKey"] if decoded else key

    key_hash = _hash_key(raw_key)
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


# ── Agent operations ──────────────────────────────────────────────────────────

async def list_agents(user_id: str, settings: Settings) -> list[AgentItem]:
    """Return all non-revoked api keys for this user as AgentItem objects."""
    pool = await get_pool(settings)
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT id, name, key_prefix, created_at, last_used_at
            FROM api_keys
            WHERE user_id = $1 AND revoked = FALSE
            ORDER BY created_at DESC
            """,
            UUID(user_id),
        )
    return [
        AgentItem(
            id=row["id"],
            name=row["name"],
            key_prefix=row["key_prefix"],
            tenant_id=user_id,
            created_at=row["created_at"],
            last_used_at=row["last_used_at"],
        )
        for row in rows
    ]


async def rename_agent(
    key_id: str, user_id: str, name: str, settings: Settings
) -> bool:
    """Rename an agent (api key). Returns True if found and updated."""
    pool = await get_pool(settings)
    async with pool.acquire() as conn:
        result = await conn.execute(
            """
            UPDATE api_keys
            SET name = $1
            WHERE id = $2 AND user_id = $3 AND revoked = FALSE
            """,
            name, UUID(key_id), UUID(user_id),
        )
    return result == "UPDATE 1"


async def delete_agent(
    key_id: str, user_id: str, settings: Settings
) -> bool:
    """Hard-delete an api key row. Returns True if a row was deleted."""
    pool = await get_pool(settings)
    async with pool.acquire() as conn:
        result = await conn.execute(
            """
            DELETE FROM api_keys
            WHERE id = $1 AND user_id = $2
            """,
            UUID(key_id), UUID(user_id),
        )
    return result == "DELETE 1"


# ── Tracy conversation operations ────────────────────────────────────────────

async def create_tracy_session(
    user_id: str,
    harness_session_id: str,
    page_scope: str,
    agent_id: Optional[str],
    trace_id: Optional[str],
    settings: Settings,
) -> str:
    """Create a tracy_session row and return its UUID."""
    pool = await get_pool(settings)
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO tracy_sessions
                (user_id, harness_session_id, page_scope, agent_id, trace_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
            """,
            UUID(user_id), harness_session_id, page_scope,
            agent_id, trace_id,
        )
    return str(row["id"])


async def get_tracy_session_by_harness_id(
    harness_session_id: str, user_id: str, settings: Settings
) -> Optional[dict]:
    """Look up an existing session by harness session ID."""
    pool = await get_pool(settings)
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT id, harness_session_id, page_scope, agent_id, trace_id
            FROM tracy_sessions
            WHERE harness_session_id = $1 AND user_id = $2
            """,
            harness_session_id, UUID(user_id),
        )
    if not row:
        return None
    return dict(row)


async def save_tracy_message(
    session_id: str,
    role: str,
    raw_message: Optional[str],
    context_message: Optional[str],
    response_text: Optional[str],
    reasoning_steps: Optional[list],
    input_tokens: Optional[int],
    output_tokens: Optional[int],
    metadata: Optional[dict],
    settings: Settings,
) -> str:
    """Insert a tracy_messages row and return its UUID."""
    pool = await get_pool(settings)
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO tracy_messages
                (session_id, role, raw_message, context_message,
                 response_text, reasoning_steps,
                 input_tokens, output_tokens, metadata)
            VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9::jsonb)
            RETURNING id
            """,
            UUID(session_id), role, raw_message, context_message,
            response_text,
            json.dumps(reasoning_steps) if reasoning_steps else None,
            input_tokens, output_tokens,
            json.dumps(metadata) if metadata else None,
        )
        # Update session timestamp
        await conn.execute(
            "UPDATE tracy_sessions SET updated_at = now() WHERE id = $1",
            UUID(session_id),
        )
    return str(row["id"])


async def list_tracy_sessions(
    user_id: str, settings: Settings, limit: int = 20
) -> list[dict]:
    """List recent Tracy sessions for a user."""
    pool = await get_pool(settings)
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT s.id, s.harness_session_id, s.page_scope,
                   s.agent_id, s.trace_id, s.created_at, s.updated_at,
                   (SELECT count(*) FROM tracy_messages m WHERE m.session_id = s.id) AS message_count
            FROM tracy_sessions s
            WHERE s.user_id = $1
            ORDER BY s.updated_at DESC
            LIMIT $2
            """,
            UUID(user_id), limit,
        )
    return [dict(r) for r in rows]


async def get_tracy_messages(
    session_id: str, user_id: str, settings: Settings
) -> list[dict]:
    """Get all messages for a Tracy session (with ownership check)."""
    pool = await get_pool(settings)
    async with pool.acquire() as conn:
        # Verify ownership
        owner = await conn.fetchval(
            "SELECT user_id FROM tracy_sessions WHERE id = $1",
            UUID(session_id),
        )
        if not owner or str(owner) != user_id:
            return []
        rows = await conn.fetch(
            """
            SELECT id, role, raw_message, context_message,
                   response_text, reasoning_steps,
                   input_tokens, output_tokens, metadata, created_at
            FROM tracy_messages
            WHERE session_id = $1
            ORDER BY created_at
            """,
            UUID(session_id),
        )
    return [dict(r) for r in rows]
