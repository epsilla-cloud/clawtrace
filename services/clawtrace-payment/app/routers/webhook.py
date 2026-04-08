"""Stripe webhook handler."""

from __future__ import annotations

import logging

import stripe
from fastapi import APIRouter, HTTPException, Request

from ..auth import get_settings
from ..database import get_pool, insert_credit_purchase
from ..models import WebhookResponse
from ..notifications import _send_slack
from ..storage import AuditWriter

logger = logging.getLogger(__name__)

router = APIRouter(tags=["webhook"])


def _stripe_val(obj: object, key: str, default: object = None) -> object:
    """Safely get a value from a Stripe object using bracket notation."""
    try:
        return obj[key]  # type: ignore[index]
    except (KeyError, TypeError, IndexError):
        return default


@router.post("/v1/stripe/webhook", response_model=WebhookResponse)
async def stripe_webhook(request: Request):
    settings = get_settings()
    stripe.api_key = settings.stripe_secret_key

    body = await request.body()
    sig = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(
            body, sig, settings.stripe_webhook_secret
        )
    except (stripe.SignatureVerificationError, ValueError) as exc:
        logger.warning("Webhook signature verification failed: %s", exc)
        raise HTTPException(status_code=400, detail=str(exc))

    event_type = _stripe_val(event, "type", "")

    if event_type == "checkout.session.completed":
        data = _stripe_val(event, "data", {})
        session = _stripe_val(data, "object", {})
        meta = _stripe_val(session, "metadata", {})

        user_id = _stripe_val(meta, "user_id")
        credits_str = _stripe_val(meta, "credits")
        pkg_id = _stripe_val(meta, "package_id", "custom")
        payment_intent = _stripe_val(session, "payment_intent")
        amount_total = _stripe_val(session, "amount_total", 0) or 0

        logger.info(
            "Webhook checkout.session.completed: user=%s credits=%s pi=%s pkg=%s",
            user_id, credits_str, payment_intent, pkg_id,
        )

        if user_id and credits_str:
            credits = float(credits_str)
            purchase_id = await insert_credit_purchase(
                user_id=str(user_id),
                credits=credits,
                source="topup",
                stripe_payment_intent_id=str(payment_intent) if payment_intent else None,
                settings=settings,
            )
            logger.info(
                "Top-up complete: user=%s credits=%s purchase=%s",
                user_id, credits, purchase_id,
            )

            # Write audit log
            audit_writer: AuditWriter = request.app.state.audit_writer
            await audit_writer.write_transaction(
                user_id=str(user_id),
                amount=credits,
                balance_after=0,
                txn_type="purchase",
                reference_id=str(payment_intent) if payment_intent else None,
            )

            # Slack notification
            try:
                pool = await get_pool(settings)
                user_row = await pool.fetchrow(
                    "SELECT email, name FROM users WHERE id = $1", str(user_id),
                )
                user_email = user_row["email"] if user_row else "unknown"
                user_name = user_row["name"] if user_row else "unknown"
                await _send_slack(
                    f":credit_card: *Credit purchase* — {user_name} ({user_email}) "
                    f"bought {credits:,.0f} credits (package: {pkg_id}, "
                    f"${int(amount_total) / 100:.2f} paid)",
                    settings,
                )
            except Exception:
                logger.exception("Failed to send purchase Slack notification")
        else:
            logger.warning(
                "Webhook missing user_id or credits in metadata: user_id=%s credits=%s",
                user_id, credits_str,
            )

    return WebhookResponse()
