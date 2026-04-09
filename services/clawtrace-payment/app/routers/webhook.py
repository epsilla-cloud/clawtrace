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


async def _create_invoice(
    customer_id: str, credits: float, amount_cents: int, pkg_label: str
) -> str | None:
    """Create a Stripe Invoice for the purchase and return the PDF URL."""
    try:
        invoice = stripe.Invoice.create(
            customer=customer_id,
            auto_advance=True,
            collection_method="send_invoice",
            days_until_due=0,
            metadata={"type": "clawtrace_credits"},
        )
        stripe.InvoiceItem.create(
            customer=customer_id,
            invoice=invoice.id,
            amount=amount_cents,
            currency="usd",
            description=f"ClawTrace {pkg_label} — {credits:,.0f} credits",
        )
        finalized = stripe.Invoice.finalize_invoice(invoice.id)
        stripe.Invoice.pay(finalized.id, paid_out_of_band=True)
        paid_invoice = stripe.Invoice.retrieve(finalized.id)
        pdf_url = _stripe_val(paid_invoice, "invoice_pdf")
        logger.info("Invoice created: %s pdf=%s", finalized.id, pdf_url)
        return str(pdf_url) if pdf_url else None
    except Exception:
        logger.exception("Failed to create invoice")
        return None


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
        amount_total = int(_stripe_val(session, "amount_total", 0) or 0)
        customer_id = _stripe_val(session, "customer")

        logger.info(
            "Webhook checkout.session.completed: user=%s credits=%s pi=%s pkg=%s customer=%s",
            user_id, credits_str, payment_intent, pkg_id, customer_id,
        )

        if user_id and credits_str:
            credits = float(credits_str)

            # Get receipt URL from the charge
            receipt_url = None
            try:
                if payment_intent:
                    pi = stripe.PaymentIntent.retrieve(str(payment_intent))
                    latest_charge = _stripe_val(pi, "latest_charge")
                    if latest_charge:
                        charge = stripe.Charge.retrieve(str(latest_charge))
                        receipt_url = _stripe_val(charge, "receipt_url")
            except Exception:
                logger.exception("Failed to get receipt URL")

            # Create formal invoice
            invoice_url = None
            if customer_id:
                invoice_url = await _create_invoice(
                    str(customer_id), credits, amount_total, str(pkg_id),
                )

            purchase_id = await insert_credit_purchase(
                user_id=str(user_id),
                credits=credits,
                source="topup",
                stripe_payment_intent_id=str(payment_intent) if payment_intent else None,
                settings=settings,
                receipt_url=str(receipt_url) if receipt_url else None,
                invoice_url=invoice_url,
                amount_paid_cents=amount_total,
            )
            logger.info(
                "Top-up complete: user=%s credits=%s purchase=%s invoice=%s",
                user_id, credits, purchase_id, bool(invoice_url),
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
                    f"${amount_total / 100:.2f} paid)",
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
