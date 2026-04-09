"""Report query consumption to the payment service (fire-and-forget)."""

from __future__ import annotations

import logging

import httpx

from .config import Settings

logger = logging.getLogger(__name__)


async def report_consumption(
    tenant_id: str, items: dict[str, float], settings: Settings
) -> None:
    """Report consumption items to the payment service. Non-blocking."""
    if not settings.payment_url:
        return
    try:
        async with httpx.AsyncClient(timeout=3) as client:
            await client.post(
                f"{settings.payment_url}/v1/consumption",
                json={"tenant_id": tenant_id, "items": items},
                headers={"x-internal-secret": settings.internal_secret},
            )
    except Exception:
        logger.debug("Failed to report consumption for %s", tenant_id)
