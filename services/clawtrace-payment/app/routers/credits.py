"""Credit endpoints — status, deficit check, and top-up."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Request

from ..auth import UserSession, get_current_user, get_settings, require_internal
from ..config import Settings
from ..database import ensure_signup_bonus, get_credit_status, check_deficit
from ..models import CreditStatus, DeficitCheckResponse, TopUpRequest, TopUpResponse

router = APIRouter(tags=["credits"])


@router.get("/v1/credits", response_model=CreditStatus)
async def get_credits(
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
):
    # Ensure signup bonus on first access
    await ensure_signup_bonus(session.db_id, settings)
    status = await get_credit_status(session.db_id, settings)
    return CreditStatus(**status)


@router.get("/v1/credits/deficit", response_model=DeficitCheckResponse)
async def check_deficit_status(
    tenant_id: str = Query(..., description="Tenant/user UUID"),
    _: None = Depends(require_internal),
    settings: Settings = Depends(get_settings),
):
    """Internal endpoint: check if a tenant is in credit deficit.

    Called by ingest/backend services to gate requests.
    Lightweight — just sums remaining credits, no side effects.
    """
    is_deficit = await check_deficit(tenant_id, settings)
    return DeficitCheckResponse(tenant_id=tenant_id, is_deficit=is_deficit)


@router.post("/v1/credits/topup", response_model=TopUpResponse)
async def topup_credits(
    body: TopUpRequest,
    request: Request,
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
):
    import stripe

    stripe.api_key = settings.stripe_secret_key

    credits_amount = body.amount_usd * settings.credits_per_dollar

    # Get or create Stripe customer
    from ..database import get_pool

    pool = await get_pool(settings)
    row = await pool.fetchrow(
        "SELECT stripe_customer_id, email, name FROM users WHERE id = $1",
        session.db_id,
    )
    customer_id = row["stripe_customer_id"] if row else None

    if not customer_id and row:
        customer = stripe.Customer.create(
            email=row["email"],
            name=row["name"],
            metadata={"clawtrace_user_id": session.db_id},
        )
        customer_id = customer.id
        await pool.execute(
            "UPDATE users SET stripe_customer_id = $1 WHERE id = $2",
            customer_id,
            session.db_id,
        )

    checkout_session = stripe.checkout.Session.create(
        mode="payment",
        customer=customer_id,
        line_items=[
            {
                "price_data": {
                    "currency": "usd",
                    "unit_amount": int(body.amount_usd * 100),
                    "product_data": {
                        "name": f"ClawTrace Credits ({credits_amount:.0f} credits)",
                    },
                },
                "quantity": 1,
            }
        ],
        success_url="https://clawtrace.ai/overview/billing?topup=success",
        cancel_url="https://clawtrace.ai/overview/billing",
        metadata={
            "user_id": session.db_id,
            "credits": str(credits_amount),
        },
    )
    return TopUpResponse(url=checkout_session.url)
