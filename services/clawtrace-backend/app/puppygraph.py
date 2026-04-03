"""
PuppyGraph HTTP client.

PuppyGraph exposes a REST API at port 8081. Cypher queries are submitted
via POST /gremlin with basic auth. The response contains a list of result
maps under data.result.data.

Auth: Basic  puppygraph:<password>
"""
from __future__ import annotations

from typing import Any

import httpx

from .config import Settings


async def run_cypher(query: str, settings: Settings) -> list[dict[str, Any]]:
    """Execute an openCypher query against PuppyGraph and return the rows."""
    url = f"{settings.puppygraph_url.rstrip('/')}/gremlin"
    payload = {
        "gremlin": query,
        "bindings": {},
        "language": "opencypher",
    }
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            url,
            json=payload,
            auth=(settings.puppygraph_user, settings.puppygraph_password),
        )
        resp.raise_for_status()
        body = resp.json()

    # PuppyGraph response shape:
    # { "result": { "data": { "@type": "g:List", "@value": [...] } }, ... }
    try:
        data = body["result"]["data"]
        if isinstance(data, dict):
            rows = data.get("@value", [])
        elif isinstance(data, list):
            rows = data
        else:
            rows = []
        # Each row may be a dict of {"@type": "g:Map", "@value": [k,v,k,v,...]}
        # or a plain dict — normalise to plain dicts
        return [_unwrap(r) for r in rows]
    except (KeyError, TypeError):
        return []


def _unwrap(value: Any) -> Any:
    """Recursively unwrap PuppyGraph's Gremlin-type-annotated values."""
    if not isinstance(value, dict):
        return value
    t = value.get("@type", "")
    v = value.get("@value", value)
    if t == "g:Map":
        # @value is a flat [k, v, k, v, ...] list
        it = iter(v)
        return {_unwrap(k): _unwrap(next(it)) for k in it}
    if t in ("g:List", "g:Set"):
        return [_unwrap(i) for i in v]
    if t in ("g:Int32", "g:Int64", "g:Float", "g:Double"):
        return v
    if isinstance(v, list):
        return [_unwrap(i) for i in v]
    if isinstance(v, dict):
        return _unwrap(v)
    return v
