"""Pydantic request/response models."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


# ── Consumption ────────────────────────────────────────────────────────────
class ConsumptionRequest(BaseModel):
    tenant_id: str
    items: dict[str, float] = Field(
        ..., description="line_item -> amount consumed"
    )


# ── Credits ────────────────────────────────────────────────────────────────
class CreditPurchase(BaseModel):
    id: str
    credits: float
    credits_initial: float
    source: str  # signup_bonus | referral_bonus | topup | admin_grant | launch_bonus
    stripe_payment_intent_id: str | None = None
    expires_at: datetime
    created_at: datetime
    status: str  # active | expired | exhausted


class CreditStatus(BaseModel):
    total_remaining: float
    purchases: list[CreditPurchase]
    is_deficit: bool


class CreditPackage(BaseModel):
    id: str
    label: str
    price_usd: float
    credits: float
    badge: str | None = None


class TopUpRequest(BaseModel):
    package_id: str = Field(..., description="One of: starter, growth, pro, scale")


class TopUpResponse(BaseModel):
    url: str
    package: CreditPackage


class DeficitCheckResponse(BaseModel):
    tenant_id: str
    is_deficit: bool


class WebhookResponse(BaseModel):
    ok: bool = True
