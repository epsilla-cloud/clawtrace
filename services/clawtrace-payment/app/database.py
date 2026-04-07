"""asyncpg pool, migrations, and credit operations."""

from __future__ import annotations

import json
import logging
from typing import Any

import asyncpg

from .config import Settings

logger = logging.getLogger(__name__)

_pool: asyncpg.Pool | None = None


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


# ── Migrations ────────────────────────────────────────────────────────────

CREATE_CREDIT_PURCHASES = """
CREATE TABLE IF NOT EXISTS credit_purchases (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    credits         DOUBLE PRECISION NOT NULL,
    credits_initial DOUBLE PRECISION NOT NULL,
    source          TEXT            NOT NULL DEFAULT 'topup',
    stripe_payment_intent_id TEXT,
    expires_at      TIMESTAMPTZ     NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);
"""

CREATE_CREDIT_PURCHASES_IDX = """
CREATE INDEX IF NOT EXISTS credit_purchases_user_active_idx
    ON credit_purchases(user_id, expires_at) WHERE credits > 0;
"""

CREATE_PENDING_NOTIFICATIONS = """
CREATE TABLE IF NOT EXISTS pending_notifications (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID        NOT NULL,
    notification_type TEXT        NOT NULL DEFAULT 'low_credit',
    first_detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    sent_at           TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, notification_type, sent_at)
);
"""

CREATE_PENDING_NOTIFICATIONS_IDX = """
CREATE INDEX IF NOT EXISTS pending_notifications_unsent_idx
    ON pending_notifications(notification_type) WHERE sent_at IS NULL;
"""


async def run_migrations(settings: Settings) -> None:
    pool = await get_pool(settings)
    async with pool.acquire() as conn:
        for sql in [
            CREATE_CREDIT_PURCHASES,
            CREATE_CREDIT_PURCHASES_IDX,
            CREATE_PENDING_NOTIFICATIONS,
            CREATE_PENDING_NOTIFICATIONS_IDX,
        ]:
            await conn.execute(sql)
    logger.info("Payment DB migrations complete")


# ── Credit operations ─────────────────────────────────────────────────────

async def ensure_signup_bonus(user_id: str, settings: Settings) -> None:
    """Grant signup + referral credits on first access (idempotent)."""
    pool = await get_pool(settings)
    async with pool.acquire() as conn:
        async with conn.transaction():
            exists = await conn.fetchval(
                "SELECT 1 FROM credit_purchases WHERE user_id = $1 LIMIT 1",
                user_id,
            )
            if exists:
                return

            expiry_interval = f"{settings.credit_expiration_days} days"

            # Signup bonus
            await conn.execute(
                """
                INSERT INTO credit_purchases
                    (user_id, credits, credits_initial, source, expires_at)
                VALUES ($1, $2, $2, 'signup_bonus',
                        now() + $3::interval)
                """,
                user_id,
                settings.default_signup_credits,
                expiry_interval,
            )
            logger.info(
                "Granted %s signup credits to %s",
                settings.default_signup_credits,
                user_id,
            )

            # Check referral
            referrer_id = await conn.fetchval(
                "SELECT referrer_id FROM referrals WHERE referred_id = $1",
                user_id,
            )
            if referrer_id:
                # Bonus for the new user
                await conn.execute(
                    """
                    INSERT INTO credit_purchases
                        (user_id, credits, credits_initial, source, expires_at)
                    VALUES ($1, $2, $2, 'referral_bonus',
                            now() + $3::interval)
                    """,
                    user_id,
                    settings.referral_new_user_credits,
                    expiry_interval,
                )
                # Bonus for the referrer
                await conn.execute(
                    """
                    INSERT INTO credit_purchases
                        (user_id, credits, credits_initial, source, expires_at)
                    VALUES ($1, $2, $2, 'referral_bonus',
                            now() + $3::interval)
                    """,
                    referrer_id,
                    settings.referral_referrer_credits,
                    expiry_interval,
                )
                logger.info(
                    "Granted referral bonus: +%s to %s, +%s to referrer %s",
                    settings.referral_new_user_credits,
                    user_id,
                    settings.referral_referrer_credits,
                    referrer_id,
                )


async def get_credit_status(
    user_id: str, settings: Settings
) -> dict[str, Any]:
    pool = await get_pool(settings)
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT id, credits, credits_initial, source, expires_at, created_at
            FROM credit_purchases
            WHERE user_id = $1 AND credits > 0 AND expires_at > now()
            ORDER BY expires_at ASC
            """,
            user_id,
        )
        total = sum(r["credits"] for r in rows)
        purchases = [
            {
                "id": str(r["id"]),
                "credits": r["credits"],
                "credits_initial": r["credits_initial"],
                "source": r["source"],
                "expires_at": r["expires_at"],
                "created_at": r["created_at"],
            }
            for r in rows
        ]
        return {
            "total_remaining": total,
            "purchases": purchases,
            "is_deficit": total <= 0,
        }


async def deduct_credits(
    tenant_id: str, amount: float, settings: Settings
) -> float:
    """Deduct credits FIFO by expiration. Returns effective balance."""
    pool = await get_pool(settings)
    async with pool.acquire() as conn:
        async with conn.transaction():
            purchases = await conn.fetch(
                """
                SELECT id, credits FROM credit_purchases
                WHERE user_id = $1 AND credits > 0 AND expires_at > now()
                ORDER BY expires_at ASC
                FOR UPDATE
                """,
                tenant_id,
            )

            remaining = amount
            for purchase in purchases:
                if remaining <= 0:
                    break
                take = min(purchase["credits"], remaining)
                new_credits = purchase["credits"] - take
                if new_credits <= 0:
                    await conn.execute(
                        "DELETE FROM credit_purchases WHERE id = $1",
                        purchase["id"],
                    )
                else:
                    await conn.execute(
                        "UPDATE credit_purchases SET credits = $1 WHERE id = $2",
                        new_credits,
                        purchase["id"],
                    )
                remaining -= take

            total_remaining = await conn.fetchval(
                """
                SELECT COALESCE(SUM(credits), 0) FROM credit_purchases
                WHERE user_id = $1 AND credits > 0 AND expires_at > now()
                """,
                tenant_id,
            )
            effective_balance = total_remaining - remaining

            # Queue low-credit notification
            if effective_balance < settings.low_credit_threshold:
                await conn.execute(
                    """
                    INSERT INTO pending_notifications
                        (user_id, notification_type, first_detected_at)
                    VALUES ($1, 'low_credit', now())
                    ON CONFLICT (user_id, notification_type, sent_at)
                        WHERE sent_at IS NULL
                    DO UPDATE SET first_detected_at = LEAST(
                        pending_notifications.first_detected_at,
                        EXCLUDED.first_detected_at
                    )
                    """,
                    tenant_id,
                )

            return effective_balance


async def insert_credit_purchase(
    user_id: str,
    credits: float,
    source: str,
    stripe_payment_intent_id: str | None,
    settings: Settings,
) -> str:
    """Insert a new credit purchase. Returns the purchase ID."""
    pool = await get_pool(settings)
    expiry_interval = f"{settings.credit_expiration_days} days"
    row = await pool.fetchrow(
        """
        INSERT INTO credit_purchases
            (user_id, credits, credits_initial, source,
             stripe_payment_intent_id, expires_at)
        VALUES ($1, $2, $2, $3, $4, now() + $5::interval)
        RETURNING id
        """,
        user_id,
        credits,
        source,
        stripe_payment_intent_id,
        expiry_interval,
    )
    return str(row["id"])  # type: ignore[index]


async def get_pending_notifications(
    settings: Settings,
) -> list[dict[str, Any]]:
    pool = await get_pool(settings)
    rows = await pool.fetch(
        """
        SELECT pn.id, pn.user_id, pn.notification_type, pn.first_detected_at,
               u.email, u.name
        FROM pending_notifications pn
        JOIN users u ON u.id = pn.user_id
        WHERE pn.sent_at IS NULL
        ORDER BY pn.first_detected_at ASC
        """
    )
    return [dict(r) for r in rows]


async def mark_notifications_sent(
    notification_ids: list[str], settings: Settings
) -> None:
    if not notification_ids:
        return
    pool = await get_pool(settings)
    await pool.execute(
        """
        UPDATE pending_notifications SET sent_at = now()
        WHERE id = ANY($1::uuid[])
        """,
        notification_ids,
    )
