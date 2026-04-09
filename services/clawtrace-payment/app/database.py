"""asyncpg pool, migrations, and credit operations."""

from __future__ import annotations

import json
import logging
from datetime import timedelta
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

ADD_INVOICE_COLUMNS = """
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='credit_purchases' AND column_name='receipt_url') THEN
    ALTER TABLE credit_purchases ADD COLUMN receipt_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='credit_purchases' AND column_name='invoice_url') THEN
    ALTER TABLE credit_purchases ADD COLUMN invoice_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='credit_purchases' AND column_name='amount_paid_cents') THEN
    ALTER TABLE credit_purchases ADD COLUMN amount_paid_cents INTEGER;
  END IF;
END $$;
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
            ADD_INVOICE_COLUMNS,
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

            expiry = timedelta(days=settings.credit_expiration_days)

            # Signup bonus
            await conn.execute(
                """
                INSERT INTO credit_purchases
                    (user_id, credits, credits_initial, source, expires_at)
                VALUES ($1, $2, $2, 'signup_bonus', now() + $3)
                """,
                user_id,
                settings.default_signup_credits,
                expiry,
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
                    VALUES ($1, $2, $2, 'referral_bonus', now() + $3)
                    """,
                    user_id,
                    settings.referral_new_user_credits,
                    expiry,
                )
                # Bonus for the referrer
                await conn.execute(
                    """
                    INSERT INTO credit_purchases
                        (user_id, credits, credits_initial, source, expires_at)
                    VALUES ($1, $2, $2, 'referral_bonus', now() + $3)
                    """,
                    referrer_id,
                    settings.referral_referrer_credits,
                    expiry,
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
    now_ts = await pool.fetchval("SELECT now()")
    async with pool.acquire() as conn:
        # Fetch ALL purchases (including expired/exhausted) for history
        rows = await conn.fetch(
            """
            SELECT id, credits, credits_initial, source,
                   stripe_payment_intent_id, receipt_url, invoice_url,
                   amount_paid_cents, expires_at, created_at
            FROM credit_purchases
            WHERE user_id = $1
            ORDER BY created_at DESC
            """,
            user_id,
        )
        # Include negative deficit rows in total for accurate balance
        total = sum(
            r["credits"] for r in rows
            if r["expires_at"] > now_ts
        )
        purchases = []
        for r in rows:
            if r["source"] == "deficit":
                status = "deficit"
            elif r["expires_at"] <= now_ts:
                status = "expired"
            elif r["credits"] <= 0:
                status = "exhausted"
            else:
                status = "active"
            purchases.append({
                "id": str(r["id"]),
                "credits": r["credits"],
                "credits_initial": r["credits_initial"],
                "source": r["source"],
                "stripe_payment_intent_id": r.get("stripe_payment_intent_id"),
                "receipt_url": r.get("receipt_url"),
                "invoice_url": r.get("invoice_url"),
                "amount_paid_cents": r.get("amount_paid_cents"),
                "expires_at": r["expires_at"],
                "created_at": r["created_at"],
                "status": status,
            })
        return {
            "total_remaining": total,
            "purchases": purchases,
            "is_deficit": total <= 0,
        }


async def deduct_credits(
    tenant_id: str, amount: float, settings: Settings
) -> float:
    """Deduct credits FIFO by expiration. Supports negative balance (deficit).
    Returns effective balance (can be negative)."""
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
                        "UPDATE credit_purchases SET credits = 0 WHERE id = $1",
                        purchase["id"],
                    )
                else:
                    await conn.execute(
                        "UPDATE credit_purchases SET credits = $1 WHERE id = $2",
                        new_credits,
                        purchase["id"],
                    )
                remaining -= take

            # If there's still remaining to deduct, record as deficit (negative credits)
            if remaining > 0:
                await conn.execute(
                    """
                    INSERT INTO credit_purchases
                        (user_id, credits, credits_initial, source, expires_at)
                    VALUES ($1, $2, 0, 'deficit', now() + interval '100 years')
                    """,
                    tenant_id,
                    -remaining,
                )

            # Total balance includes negative deficit rows
            effective_balance = await conn.fetchval(
                """
                SELECT COALESCE(SUM(credits), 0) FROM credit_purchases
                WHERE user_id = $1 AND expires_at > now()
                """,
                tenant_id,
            )

            # Queue notifications based on balance
            if effective_balance <= 0:
                # Deficit: queue exhaustion notification
                await conn.execute(
                    """
                    INSERT INTO pending_notifications
                        (user_id, notification_type, first_detected_at)
                    VALUES ($1, 'credit_exhausted', now())
                    ON CONFLICT (user_id, notification_type, sent_at)
                        WHERE sent_at IS NULL
                    DO NOTHING
                    """,
                    tenant_id,
                )
            elif effective_balance < settings.low_credit_threshold:
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


async def check_deficit(tenant_id: str, settings: Settings) -> bool:
    """Lightweight check: is the tenant in deficit (total credits <= 0)?
    Includes negative deficit rows in the sum."""
    pool = await get_pool(settings)
    total = await pool.fetchval(
        """
        SELECT COALESCE(SUM(credits), 0) FROM credit_purchases
        WHERE user_id = $1 AND expires_at > now()
        """,
        tenant_id,
    )
    return total <= 0


async def insert_credit_purchase(
    user_id: str,
    credits: float,
    source: str,
    stripe_payment_intent_id: str | None,
    settings: Settings,
    receipt_url: str | None = None,
    invoice_url: str | None = None,
    amount_paid_cents: int | None = None,
) -> str:
    """Insert a new credit purchase. Absorbs any outstanding deficit first.
    Returns the purchase ID."""
    pool = await get_pool(settings)
    expiry = timedelta(days=settings.credit_expiration_days)

    async with pool.acquire() as conn:
        async with conn.transaction():
            # Insert the new purchase
            row = await conn.fetchrow(
                """
                INSERT INTO credit_purchases
                    (user_id, credits, credits_initial, source,
                     stripe_payment_intent_id, receipt_url, invoice_url,
                     amount_paid_cents, expires_at)
                VALUES ($1, $2, $2, $3, $4, $5, $6, $7, now() + $8)
                RETURNING id
                """,
                user_id,
                credits,
                source,
                stripe_payment_intent_id,
                receipt_url,
                invoice_url,
                amount_paid_cents,
                expiry,
            )
            purchase_id = str(row["id"])

            # Absorb any outstanding deficit rows
            deficit_total = await conn.fetchval(
                """
                SELECT COALESCE(SUM(credits), 0) FROM credit_purchases
                WHERE user_id = $1 AND source = 'deficit' AND credits < 0
                """,
                user_id,
            )
            if deficit_total < 0:
                absorb = min(credits, abs(deficit_total))
                # Reduce the new purchase by the absorbed amount
                await conn.execute(
                    "UPDATE credit_purchases SET credits = credits - $1 WHERE id = $2",
                    absorb,
                    row["id"],
                )
                # Delete deficit rows (they've been absorbed)
                await conn.execute(
                    "DELETE FROM credit_purchases WHERE user_id = $1 AND source = 'deficit' AND credits < 0",
                    user_id,
                )
                logger.info(
                    "Absorbed %.2f deficit credits for user %s from new purchase",
                    absorb, user_id,
                )

    return purchase_id


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
