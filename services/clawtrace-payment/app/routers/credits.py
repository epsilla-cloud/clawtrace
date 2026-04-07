"""Credit endpoints — packages, status, deficit check, and top-up."""

from __future__ import annotations

import json
import logging

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status

from ..auth import UserSession, get_current_user, get_settings, require_internal
from ..config import Settings
from ..database import check_deficit, ensure_signup_bonus, get_credit_status, get_pool
from ..models import (
    CreditPackage,
    CreditStatus,
    DeficitCheckResponse,
    TopUpRequest,
    TopUpResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(tags=["credits"])


def _load_packages(settings: Settings) -> list[CreditPackage]:
    raw = json.loads(settings.credit_packages_json)
    return [CreditPackage(**p) for p in raw]


# ── GET /v1/credits/packages — list available packages ────────────────────

@router.get("/v1/credits/packages", response_model=list[CreditPackage])
async def list_packages(
    settings: Settings = Depends(get_settings),
):
    """Public: return the available credit top-up packages."""
    return _load_packages(settings)


# ── GET /v1/credits — current user's credit status ───────────────────────

@router.get("/v1/credits", response_model=CreditStatus)
async def get_credits(
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
):
    await ensure_signup_bonus(session.db_id, settings)
    result = await get_credit_status(session.db_id, settings)
    return CreditStatus(**result)


# ── GET /v1/credits/deficit — internal lightweight check ─────────────────

@router.get("/v1/credits/deficit", response_model=DeficitCheckResponse)
async def check_deficit_status(
    tenant_id: str = Query(..., description="Tenant/user UUID"),
    _: None = Depends(require_internal),
    settings: Settings = Depends(get_settings),
):
    is_deficit = await check_deficit(tenant_id, settings)
    return DeficitCheckResponse(tenant_id=tenant_id, is_deficit=is_deficit)


# ── POST /v1/credits/topup — Stripe checkout for a credit package ────────

@router.post("/v1/credits/topup", response_model=TopUpResponse)
async def topup_credits(
    body: TopUpRequest,
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
):
    import stripe

    stripe.api_key = settings.stripe_secret_key

    # Resolve package
    packages = _load_packages(settings)
    package = next((p for p in packages if p.id == body.package_id), None)
    if not package:
        valid = [p.id for p in packages]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown package_id '{body.package_id}'. Valid: {valid}",
        )

    # Get or create Stripe customer
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

    # Build product description
    bonus = package.credits - (package.price_usd * 100)
    desc_parts = [f"{package.credits:,.0f} credits"]
    if bonus > 0:
        desc_parts.append(f"includes {bonus:,.0f} bonus")

    checkout_session = stripe.checkout.Session.create(
        mode="payment",
        customer=customer_id,
        line_items=[
            {
                "price_data": {
                    "currency": "usd",
                    "unit_amount": int(package.price_usd * 100),
                    "product_data": {
                        "name": f"ClawTrace {package.label} — {' · '.join(desc_parts)}",
                    },
                },
                "quantity": 1,
            }
        ],
        success_url="https://clawtrace.ai/overview/billing?topup=success",
        cancel_url="https://clawtrace.ai/overview/billing",
        metadata={
            "user_id": session.db_id,
            "package_id": package.id,
            "credits": str(package.credits),
        },
    )

    logger.info(
        "Checkout created: user=%s package=%s credits=%s",
        session.db_id,
        package.id,
        package.credits,
    )
    return TopUpResponse(url=checkout_session.url, package=package)
