"""Deficit guard — reusable module for ingest/backend services.

Maintains a local cache of tenant deficit status with periodic refresh.
When a request arrives, checks the cache:
  - If last check < 15 min ago and not deficit → allow
  - If deficit → deny (check every request until cleared)
  - If stale (>15 min) → re-check via payment service API

Copy this file into ingest/backend services, or import from a shared package.
"""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field

import httpx
from fastapi import HTTPException, status

logger = logging.getLogger(__name__)

# Default check interval: 15 minutes
DEFAULT_CHECK_INTERVAL_SECONDS = 900


@dataclass
class _TenantEntry:
    is_deficit: bool = False
    last_checked: float = 0.0


@dataclass
class DeficitGuard:
    """Caches per-tenant deficit status, refreshing every `check_interval_s`.

    Usage in a FastAPI dependency:

        guard = DeficitGuard(payment_url="http://clawtrace-payment:80",
                             internal_secret="shared-secret")

        async def require_no_deficit(tenant_id: str = ...):
            await guard.check(tenant_id)
    """

    payment_url: str = ""
    internal_secret: str = ""
    check_interval_s: int = DEFAULT_CHECK_INTERVAL_SECONDS
    _cache: dict[str, _TenantEntry] = field(default_factory=dict)

    async def check(self, tenant_id: str) -> None:
        """Raise 402 if tenant is in deficit. Caches OK status for check_interval_s."""
        now = time.monotonic()
        entry = self._cache.get(tenant_id)

        if entry is not None:
            age = now - entry.last_checked
            # If NOT deficit and within interval → pass
            if not entry.is_deficit and age < self.check_interval_s:
                return
            # If deficit → always re-check (user might have topped up)
            # If stale → re-check

        # Call payment service
        is_deficit = await self._remote_check(tenant_id)
        self._cache[tenant_id] = _TenantEntry(
            is_deficit=is_deficit, last_checked=now
        )

        if is_deficit:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail={
                    "error": "credit_deficit",
                    "message": (
                        "Your ClawTrace credits are exhausted. "
                        "Please top up at https://clawtrace.ai/billing"
                    ),
                },
            )

    async def _remote_check(self, tenant_id: str) -> bool:
        if not self.payment_url:
            # Payment service not configured — allow all (dev mode)
            return False
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                resp = await client.get(
                    f"{self.payment_url}/v1/credits/deficit",
                    params={"tenant_id": tenant_id},
                    headers={"x-internal-secret": self.internal_secret},
                )
                if resp.status_code == 200:
                    return resp.json().get("is_deficit", False)
                logger.warning(
                    "Deficit check returned %d for tenant %s",
                    resp.status_code,
                    tenant_id,
                )
                return False  # fail-open on error
        except Exception:
            logger.exception("Deficit check failed for tenant %s", tenant_id)
            return False  # fail-open on network error
