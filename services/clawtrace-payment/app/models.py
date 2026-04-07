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


class TopUpRequest(BaseModel):
    amount_usd: float = Field(..., gt=0, le=10000, description="USD amount")


class TopUpResponse(BaseModel):
    url: str


class WebhookResponse(BaseModel):
    ok: bool = True
