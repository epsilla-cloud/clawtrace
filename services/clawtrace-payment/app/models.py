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
    source: str
    expires_at: datetime
    created_at: datetime


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
