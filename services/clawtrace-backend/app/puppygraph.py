"""
PuppyGraph HTTP client.

Endpoint: POST /submitCypher  (discovered from PuppyGraph v0.113 UI source)
Auth:     session cookie — login once via POST /login, reuse cookie.
Response: [{"Keys": [...], "Values": [...]}, ...]  — one dict per row.
"""
from __future__ import annotations

import asyncio
from typing import Any, Optional

import httpx

from .config import Settings

# Module-level cookie jar — reused across requests in the same process
_cookies: Optional[dict[str, str]] = None
_cookie_lock = asyncio.Lock()


async def _ensure_logged_in(settings: Settings) -> dict[str, str]:
    """Return a valid session cookie, logging in if necessary."""
    global _cookies
    async with _cookie_lock:
        if _cookies:
            return _cookies
        base = settings.puppygraph_url.rstrip("/")
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                f"{base}/login",
                json={"username": settings.puppygraph_user,
                      "password": settings.puppygraph_password},
            )
            resp.raise_for_status()
        _cookies = dict(resp.cookies)
        return _cookies


def _invalidate_session() -> None:
    global _cookies
    _cookies = None


async def run_cypher(query: str, settings: Settings) -> list[dict[str, Any]]:
    """
    Execute a Cypher query via POST /submitCypher and return rows as plain dicts.

    PuppyGraph response shape:
      [{"Keys": ["col1","col2"], "Values": [val1, val2]}, ...]

    Each item maps to one result row.
    """
    base = settings.puppygraph_url.rstrip("/")
    cookies = await _ensure_logged_in(settings)

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{base}/submitCypher",
            json={"query": query, "timeoutMs": 25000},
            cookies=cookies,
        )
        # Session expired — re-login once
        if resp.status_code in (401, 403):
            _invalidate_session()
            cookies = await _ensure_logged_in(settings)
            resp = await client.post(
                f"{base}/submitCypher",
                json={"query": query, "timeoutMs": 25000},
                cookies=cookies,
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
            # Scalar values are returned directly; vertex/edge values have
            # ElementId / Props — extract Props for attribute access
            if isinstance(v, dict) and "Props" in v:
                row[k] = v["Props"]
            else:
                row[k] = v
        rows.append(row)
    return rows
