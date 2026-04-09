"""
Tracy MCP Server — Streamable HTTP transport.

Exposes a single `run_cypher_query` tool that lets Tracy (the managed Claude
agent) run Cypher queries against PuppyGraph with tenant data isolation.

Protocol: JSON-RPC 2.0 over POST /tracy/mcp
Auth:     Authorization: Bearer <internal_secret>
"""
from __future__ import annotations

import hmac
import json
import logging
from typing import Any, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Request, Response

from ..auth import get_settings
from ..config import Settings
from ..puppygraph import run_cypher

logger = logging.getLogger(__name__)

router = APIRouter(tags=["tracy-mcp"])

# ---------------------------------------------------------------------------
# Graph schema description — embedded in the tool so Tracy knows what to query
# ---------------------------------------------------------------------------
GRAPH_SCHEMA_DESCRIPTION = """\
ClawTrace PuppyGraph schema (Cypher):

VERTEX TYPES:
  Tenant   — id: tenant_id (String). Root of hierarchy.
  Agent    — id: agent_id (String). Props: tenant_id.
  Trace    — id: trace_id (String). Props: tenant_id, agent_id, agent_name,
             session_key, trace_start_ts_ms (Long), trace_end_ts_ms (Long),
             duration_ms (Long), event_count (Long), trace_date (Date).
  Span     — id: span_id (String). Props: tenant_id, agent_id, trace_id,
             parent_span_id (nullable), span_start_ts_ms (Long),
             span_end_ts_ms (Long), duration_ms (Long), actor_label (String),
             actor_type (llm_call|tool_call|subagent|session),
             input_tokens (Long), output_tokens (Long), total_tokens (Long),
             has_error (Int 0|1), input_payload (JSON String),
             output_payload (JSON String).

EDGE TYPES:
  Tenant -[:HAS_AGENT]-> Agent
  Agent  -[:OWNS]->      Trace
  Trace  -[:HAS_SPAN]->  Span
  Span   -[:CHILD_OF]->  Span   (child -> parent; only when parent_span_id IS NOT NULL)

IMPORTANT CYPHER RULES:
  - Use elementId(v) for vertex identity (returns "Label[uuid]").
  - Use v.attribute for property access (e.g. t.tenant_id, s.actor_type).
  - String values must be single-quoted: WHERE t.tenant_id = 'abc-123'
  - EVERY query MUST include a WHERE filter on tenant_id for data isolation.
  - If agent_id is provided, the query MUST also filter on agent_id.
  - If trajectory_id is provided, the query MUST also filter on trace_id matching that value.
  - Prefer direct attribute filters (WHERE s.trace_id = '...') over edge traversal for performance.
  - PuppyGraph supports: MATCH, OPTIONAL MATCH, WHERE, RETURN, ORDER BY, LIMIT, SKIP, count(), sum(), avg(), min(), max(), collect(), DISTINCT, CASE WHEN, coalesce(), substring().
"""

# ---------------------------------------------------------------------------
# MCP tool definition
# ---------------------------------------------------------------------------
MCP_TOOL = {
    "name": "run_cypher_query",
    "description": (
        "Execute a Cypher query against the ClawTrace PuppyGraph database to "
        "analyze agent execution trajectories, spans, tokens, costs, and errors. "
        "SECURITY: The query MUST contain a WHERE filter on tenant_id matching the "
        "provided tenant_id. If agent_id is given, the query must also filter on it. "
        "If trajectory_id is given, the query must filter on trace_id = trajectory_id.\n\n"
        + GRAPH_SCHEMA_DESCRIPTION
    ),
    "inputSchema": {
        "type": "object",
        "properties": {
            "tenant_id": {
                "type": "string",
                "description": "The tenant UUID to scope all queries to (REQUIRED in every query WHERE clause).",
            },
            "agent_id": {
                "type": "string",
                "description": "Optional agent UUID. If provided, query MUST also filter on agent_id.",
            },
            "trajectory_id": {
                "type": "string",
                "description": "Optional trajectory/trace UUID. If provided, query MUST filter on trace_id = this value.",
            },
            "query": {
                "type": "string",
                "description": "The Cypher query to execute. Must include tenant_id filter.",
            },
        },
        "required": ["tenant_id", "query"],
    },
}

# ---------------------------------------------------------------------------
# MCP server info
# ---------------------------------------------------------------------------
SERVER_INFO = {
    "protocolVersion": "2025-03-26",
    "capabilities": {"tools": {"listChanged": False}},
    "serverInfo": {"name": "ClawTrace Tracy MCP", "version": "1.0.0"},
}


# ---------------------------------------------------------------------------
# Auth helper
# ---------------------------------------------------------------------------
def _verify_bearer(authorization: Optional[str], settings: Settings) -> None:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = authorization[7:]
    if not hmac.compare_digest(token, settings.internal_secret):
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------------------------------------------------------------------------
# Security: validate tenant isolation in query
# ---------------------------------------------------------------------------
def _validate_tenant_isolation(
    query: str,
    tenant_id: str,
    agent_id: Optional[str],
    trajectory_id: Optional[str],
) -> Optional[str]:
    """Return an error message if the query violates tenant isolation, else None."""
    # The tenant_id value must appear in the query
    if tenant_id not in query:
        return (
            f"Security violation: query must contain a WHERE filter on "
            f"tenant_id = '{tenant_id}'. The tenant_id value was not found in the query."
        )
    # If agent_id provided, it must appear in the query
    if agent_id and agent_id not in query:
        return (
            f"Security violation: agent_id '{agent_id}' was provided but not found "
            f"in the query. The query must filter on agent_id when it is specified."
        )
    # If trajectory_id provided, it must appear in the query
    if trajectory_id and trajectory_id not in query:
        return (
            f"Security violation: trajectory_id '{trajectory_id}' was provided but not "
            f"found in the query. The query must filter on trace_id when trajectory_id is specified."
        )
    return None


# ---------------------------------------------------------------------------
# Tool call handler
# ---------------------------------------------------------------------------
async def _handle_tool_call(
    name: str, arguments: dict[str, Any], settings: Settings
) -> dict[str, Any]:
    """Execute a tool and return MCP CallToolResult."""
    if name != "run_cypher_query":
        return {
            "content": [{"type": "text", "text": f"Unknown tool: {name}"}],
            "isError": True,
        }

    tenant_id = arguments.get("tenant_id", "")
    agent_id = arguments.get("agent_id")
    trajectory_id = arguments.get("trajectory_id")
    query = arguments.get("query", "")

    if not tenant_id or not query:
        return {
            "content": [{"type": "text", "text": "tenant_id and query are required."}],
            "isError": True,
        }

    # Security check
    violation = _validate_tenant_isolation(query, tenant_id, agent_id, trajectory_id)
    if violation:
        logger.warning("Tracy MCP security violation: %s", violation)
        return {
            "content": [{"type": "text", "text": violation}],
            "isError": True,
        }

    # Execute query
    try:
        rows = await run_cypher(query, settings)
        result_text = json.dumps(rows, default=str)
        # Truncate very large results to avoid blowing up context
        if len(result_text) > 100_000:
            result_text = result_text[:100_000] + "\n... [truncated, too many results — add LIMIT to your query]"
        return {
            "content": [{"type": "text", "text": result_text}],
            "isError": False,
        }
    except Exception as exc:
        logger.exception("Tracy MCP query failed")
        return {
            "content": [{"type": "text", "text": f"Query execution error: {exc}"}],
            "isError": True,
        }


# ---------------------------------------------------------------------------
# MCP endpoint — Streamable HTTP (single POST endpoint)
# ---------------------------------------------------------------------------
@router.post("/tracy/mcp")
async def tracy_mcp(
    request: Request,
    authorization: Optional[str] = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> Response:
    _verify_bearer(authorization, settings)

    body = await request.json()
    method = body.get("method")
    req_id = body.get("id")

    # Notifications (no id) → 202 Accepted
    if req_id is None:
        return Response(status_code=202)

    # initialize
    if method == "initialize":
        return _jsonrpc_ok(req_id, SERVER_INFO)

    # tools/list
    if method == "tools/list":
        return _jsonrpc_ok(req_id, {"tools": [MCP_TOOL]})

    # tools/call
    if method == "tools/call":
        params = body.get("params", {})
        tool_name = params.get("name", "")
        arguments = params.get("arguments", {})
        result = await _handle_tool_call(tool_name, arguments, settings)
        return _jsonrpc_ok(req_id, result)

    # Unknown method
    return _jsonrpc_error(req_id, -32601, f"Method not found: {method}")


# ---------------------------------------------------------------------------
# JSON-RPC helpers
# ---------------------------------------------------------------------------
def _jsonrpc_ok(req_id: Any, result: Any) -> Response:
    return Response(
        content=json.dumps({"jsonrpc": "2.0", "id": req_id, "result": result}),
        media_type="application/json",
    )


def _jsonrpc_error(req_id: Any, code: int, message: str) -> Response:
    return Response(
        content=json.dumps(
            {"jsonrpc": "2.0", "id": req_id, "error": {"code": code, "message": message}}
        ),
        media_type="application/json",
    )
