"""Stripe webhook handler."""

from __future__ import annotations

import logging

import stripe
from fastapi import APIRouter, HTTPException, Request

from ..auth import get_settings
from ..database import insert_credit_purchase
from ..models import WebhookResponse
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
        raise HTTPException(status_code=400, detail=str(exc))

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        metadata = session.get("metadata", {})
        user_id = metadata.get("user_id")
        credits_str = metadata.get("credits")
        payment_intent = session.get("payment_intent")

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
                user_id,
                credits,
                purchase_id,
            )

            # Write audit log
            audit_writer: AuditWriter = request.app.state.audit_writer
            await audit_writer.write_transaction(
                user_id=user_id,
                amount=credits,
                balance_after=0,  # Will be recalculated on next status check
                txn_type="purchase",
                reference_id=payment_intent,
            )

    return WebhookResponse()
