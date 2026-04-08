"""Databricks SQL Statement API client for querying usage data."""

from __future__ import annotations

import logging
from datetime import datetime, timezone

import httpx

from .config import Settings

logger = logging.getLogger(__name__)


async def query_usage(
    user_id: str,
    from_ms: int,
    to_ms: int,
    settings: Settings,
) -> dict:
    """Query billing_usage_hourly from Databricks for a tenant's usage."""
    if not settings.databricks_host or not settings.databricks_token:
        return {"total_spent": 0, "categories": [], "series": []}

    from_dt = datetime.fromtimestamp(from_ms / 1000, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    to_dt = datetime.fromtimestamp(to_ms / 1000, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    # Determine bucket size based on range
    range_ms = to_ms - from_ms
    if range_ms <= 86_400_000:  # 1 day → hourly
        bucket_expr = "hour_bucket"
    elif range_ms <= 30 * 86_400_000:  # 30 days → daily
        bucket_expr = "date_trunc('day', hour_bucket)"
    else:  # > 30 days → weekly
        bucket_expr = "date_trunc('week', hour_bucket)"

    sql = f"""
    SELECT
        {bucket_expr} AS bucket,
        category,
        SUM(total_credits) AS credits,
        SUM(total_raw) AS raw_total
    FROM billing_usage_hourly
    WHERE user_id = '{user_id}'
      AND hour_bucket >= '{from_dt}'
      AND hour_bucket <= '{to_dt}'
    GROUP BY {bucket_expr}, category
    ORDER BY bucket
    """

    total_sql = f"""
    SELECT COALESCE(SUM(total_credits), 0) AS total
    FROM billing_usage_hourly
    WHERE user_id = '{user_id}'
      AND hour_bucket >= '{from_dt}'
      AND hour_bucket <= '{to_dt}'
    """

    category_sql = f"""
    SELECT category, SUM(total_credits) AS total
    FROM billing_usage_hourly
    WHERE user_id = '{user_id}'
      AND hour_bucket >= '{from_dt}'
      AND hour_bucket <= '{to_dt}'
    GROUP BY category
    ORDER BY total DESC
    """

    try:
        total_rows = await _run_sql(total_sql, settings)
        category_rows = await _run_sql(category_sql, settings)
        series_rows = await _run_sql(sql, settings)

        total_spent = float(total_rows[0][0]) if total_rows else 0

        categories = [
            {"category": r[0], "total": float(r[1])}
            for r in category_rows
        ]

        # Build time series grouped by bucket
        buckets: dict[str, dict[str, float]] = {}
        for r in series_rows:
            key = str(r[0])[:16]  # trim to "YYYY-MM-DD HH:MM"
            if key not in buckets:
                buckets[key] = {}
            buckets[key][r[1]] = float(r[2])

        series = [
            {"date": k, **v}
            for k, v in sorted(buckets.items())
        ]

        return {
            "total_spent": total_spent,
            "categories": categories,
            "series": series,
        }

    except Exception:
        logger.exception("Failed to query Databricks usage data")
        return {"total_spent": 0, "categories": [], "series": []}


async def _run_sql(sql: str, settings: Settings) -> list[list]:
    """Execute SQL via Databricks SQL Statement API and return rows."""
    url = f"https://{settings.databricks_host}/api/2.0/sql/statements/"
    headers = {
        "Authorization": f"Bearer {settings.databricks_token}",
        "Content-Type": "application/json",
    }
    body = {
        "warehouse_id": settings.databricks_warehouse_id,
        "statement": sql,
        "wait_timeout": "30s",
    }

    async with httpx.AsyncClient(timeout=35) as client:
        resp = await client.post(url, json=body, headers=headers)
        resp.raise_for_status()
        data = resp.json()

        status = data.get("status", {}).get("state", "")
        if status == "FAILED":
            error = data.get("status", {}).get("error", {}).get("message", "unknown")
            raise RuntimeError(f"Databricks SQL failed: {error}")

        result = data.get("result", {})
        rows = result.get("data_array", [])
        return rows
