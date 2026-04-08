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

    if event.type == "checkout.session.completed":
        session = event.data.object
        # Convert Stripe metadata object to a plain dict
        metadata = dict(session.metadata) if session.metadata else {}
        user_id = metadata.get("user_id")
        credits_str = metadata.get("credits")
        payment_intent = getattr(session, "payment_intent", None)

        logger.info(
            "Webhook checkout.session.completed: user=%s credits=%s pi=%s",
            user_id, credits_str, payment_intent,
        )

        if user_id and credits_str:
            credits = float(credits_str)
            purchase_id = await insert_credit_purchase(
                user_id=user_id,
                credits=credits,
                source="topup",
                stripe_payment_intent_id=payment_intent,
                settings=settings,
            )
            logger.info(
                "Top-up complete: user=%s credits=%s purchase=%s",
                user_id, credits, purchase_id,
            )

            # Write audit log
            audit_writer: AuditWriter = request.app.state.audit_writer
            await audit_writer.write_transaction(
                user_id=user_id,
                amount=credits,
                balance_after=0,
                txn_type="purchase",
                reference_id=payment_intent,
            )
            # Slack notification
            try:
                pool = await get_pool(settings)
                user_row = await pool.fetchrow(
                    "SELECT email, name FROM users WHERE id = $1", user_id,
                )
                user_email = user_row["email"] if user_row else "unknown"
                user_name = user_row["name"] if user_row else "unknown"
                pkg_id = metadata.get("package_id", "custom")
                amount_cents = getattr(session, "amount_total", 0) or 0
                await _send_slack(
                    f":credit_card: *Credit purchase* — {user_name} ({user_email}) "
                    f"bought {credits:,.0f} credits (package: {pkg_id}, "
                    f"${amount_cents / 100:.2f} paid)",
                    settings,
                )
            except Exception:
                logger.exception("Failed to send purchase Slack notification")
        else:
            logger.warning("Webhook missing user_id or credits in metadata: %s", metadata)

    return WebhookResponse()
