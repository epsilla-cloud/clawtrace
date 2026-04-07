"""Pricing table: maps line-item keys to credits-per-unit rates."""

from __future__ import annotations

import json
import logging

logger = logging.getLogger(__name__)


def load_pricing_table(json_str: str) -> dict[str, float]:
    try:
        table = json.loads(json_str)
        if not isinstance(table, dict):
            raise ValueError("pricing table must be a JSON object")
        return {str(k): float(v) for k, v in table.items()}
    except Exception:
        logger.exception("Failed to parse pricing_table_json, using empty table")
        return {}


def calculate_credits(
    usage: dict[str, float], pricing: dict[str, float]
) -> float:
    """Given a usage map and pricing table, return total credits consumed."""
    total = 0.0
    for line_item, amount in usage.items():
        rate = pricing.get(line_item, 0.0)
        total += amount * rate
    return total
