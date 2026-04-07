"""POST /v1/consumption — accept usage data from internal services."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from ..auth import require_internal
from ..models import ConsumptionRequest

router = APIRouter(tags=["consumption"])


@router.post("/v1/consumption")
async def accept_consumption(
    body: ConsumptionRequest,
    request: Request,
    _: None = Depends(require_internal),
):
    store = request.app.state.store
    store.accept(body.tenant_id, body.items)
    return {"ok": True}
