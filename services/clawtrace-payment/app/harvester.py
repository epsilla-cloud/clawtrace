"""Harvest job: consume in-memory usage, deduct credits, write audit."""

from __future__ import annotations

import logging

from .config import Settings
from .consumption import ConsumptionStore
from .database import deduct_credits
from .pricing import calculate_credits, load_pricing_table
from .storage import AuditWriter

logger = logging.getLogger(__name__)


async def run_harvest(
    store: ConsumptionStore,
    audit_writer: AuditWriter,
    settings: Settings,
) -> None:
    snapshot = store.harvest_all()
    if not snapshot:
        return

    pricing = load_pricing_table(settings.pricing_table_json)
    processed = 0

    for tenant_id, usage_map in snapshot.items():
        total_credits = calculate_credits(usage_map, pricing)
        if total_credits <= 0:
            continue

        # Build per-category cost breakdown
        cost_breakdown = {}
        for category, raw_amount in usage_map.items():
            rate = pricing.get(category, 0.0)
            credits_spent = raw_amount * rate
            if credits_spent > 0:
                cost_breakdown[category] = {
                    "raw_amount": raw_amount,
                    "rate": rate,
                    "credits_spent": credits_spent,
                }

        try:
            effective_balance = await deduct_credits(
                tenant_id, total_credits, settings
            )
            await audit_writer.write_transaction(
                user_id=tenant_id,
                amount=-total_credits,
                balance_after=effective_balance,
                txn_type="harvest",
                description=usage_map,
                cost_breakdown=cost_breakdown,
            )
            processed += 1
        except Exception:
            logger.exception(
                "Failed to harvest credits for tenant %s", tenant_id
            )

    if processed:
        logger.info(
            "Harvest complete: %d/%d tenants processed",
            processed,
            len(snapshot),
        )
