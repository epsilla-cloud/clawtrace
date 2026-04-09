"""Deficit guard — caches per-tenant credit deficit status.

Checks payment service every `check_interval_s` (default 15 min).
If deficit → every request re-checks until cleared.
If OK → cached for the full interval.
Fail-open on network errors (so ingest doesn't break if payment is down).
"""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field

import httpx
from fastapi import HTTPException, status

logger = logging.getLogger(__name__)


@dataclass
class _TenantEntry:
    is_deficit: bool = False
    last_checked: float = 0.0


@dataclass
class DeficitGuard:
    payment_url: str = ""
    internal_secret: str = ""
    check_interval_s: int = 900

    _cache: dict[str, _TenantEntry] = field(default_factory=dict)

    async def check(self, tenant_id: str) -> None:
        """Raise 402 if tenant is in deficit."""
        now = time.monotonic()
        entry = self._cache.get(tenant_id)

        if entry is not None:
            age = now - entry.last_checked
            if not entry.is_deficit and age < self.check_interval_s:
                return  # cached OK

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
            return False  # payment not configured — allow all
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
                    "Deficit check returned %d for %s", resp.status_code, tenant_id
                )
                return False
        except Exception:
            logger.exception("Deficit check failed for %s", tenant_id)
            return False
