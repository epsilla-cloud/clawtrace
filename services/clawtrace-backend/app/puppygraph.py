"""
PuppyGraph HTTP client.

Uses HTTP Basic Auth for all requests — works with both:
  - http://localhost:8081  (internal, direct PuppyGraph)
  - https://puppy.clawtrace.ai (public URL via reverse proxy)

Endpoint: POST /submitCypher
Response: [{"Keys": [...], "Values": [...]}]  — one dict per row
"""
from __future__ import annotations

from typing import Any

import httpx

from .config import Settings


async def run_cypher(query: str, settings: Settings) -> list[dict[str, Any]]:
    """Execute a Cypher query via POST /submitCypher and return rows as plain dicts."""
    base = settings.puppygraph_url.rstrip("/")
    auth = (settings.puppygraph_user, settings.puppygraph_password)

    async with httpx.AsyncClient(auth=auth, timeout=30) as client:
        resp = await client.post(
            f"{base}/submitCypher",
            json={"query": query, "timeoutMs": 25000},
        )
        resp.raise_for_status()

    raw = resp.json()
    if not isinstance(raw, list):
        return []

    rows: list[dict[str, Any]] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        keys   = item.get("Keys", [])
        values = item.get("Values", [])
        if not keys:
            continue
        row: dict[str, Any] = {}
        for k, v in zip(keys, values):
            if isinstance(v, dict) and "Props" in v:
                row[k] = v["Props"]
            else:
                row[k] = v
        rows.append(row)
    return rows
