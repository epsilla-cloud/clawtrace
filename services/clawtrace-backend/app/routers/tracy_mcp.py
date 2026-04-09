"""
Tracy MCP Server — Streamable HTTP transport.

Exposes a single `run_cypher_query` tool that lets Tracy (the managed Claude
agent) run Cypher queries against PuppyGraph with tenant data isolation.

Protocol:  JSON-RPC 2.0 over POST /tracy/mcp
Auth:      Static Bearer token via Anthropic vault
Security:  Tenant isolation enforced per query (tenant_id must appear in Cypher)
"""
from __future__ import annotations

import json
import logging
from typing import Any, Optional

from fastapi import APIRouter, Depends, Request, Response

from ..auth import get_settings
from ..config import Settings
from ..puppygraph import run_cypher

logger = logging.getLogger(__name__)

router = APIRouter(tags=["tracy-mcp"])

# ---------------------------------------------------------------------------
# MCP tool definition — kept concise; schema knowledge belongs in system prompt
# ---------------------------------------------------------------------------
MCP_TOOL = {
    "name": "run_cypher_query",
    "description": (
        "Execute a Cypher query against the ClawTrace PuppyGraph graph database. "
        "Returns rows as JSON. The server enforces tenant data isolation: the query "
        "string must contain the provided tenant_id (and agent_id / trajectory_id if given), "
        "otherwise the request is rejected."
    ),
    "inputSchema": {
        "type": "object",
        "properties": {
            "tenant_id": {
                "type": "string",
                "description": "Tenant UUID. Must appear in the query WHERE clause.",
            },
            "agent_id": {
                "type": "string",
                "description": "Agent UUID. If provided, must also appear in the query.",
            },
            "trajectory_id": {
                "type": "string",
                "description": "Trace UUID. If provided, must appear in the query as trace_id filter.",
            },
            "query": {
                "type": "string",
                "description": "Cypher query. Must include a WHERE filter on tenant_id.",
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
# Security: validate tenant isolation in query
# ---------------------------------------------------------------------------
def _validate_tenant_isolation(
    query: str,
    tenant_id: str,
    agent_id: Optional[str],
    trajectory_id: Optional[str],
) -> Optional[str]:
    """Return an error message if the query violates tenant isolation, else None.

    tenant_id is always required. agent_id and trajectory_id are enforced
    when provided — Tracy must scope queries to the user's current context.
    """
    if tenant_id not in query:
        return (
            f"Security violation: query must contain a WHERE filter on "
            f"tenant_id = '{tenant_id}'. The tenant_id value was not found in the query."
        )
    if agent_id and agent_id not in query:
        return (
            f"Scope violation: agent_id '{agent_id}' was provided but not found "
            f"in the query. When agent_id is given, the query must filter on it. "
            f"If you need a cross-agent query, omit agent_id from the tool call arguments."
        )
    if trajectory_id and trajectory_id not in query:
        return (
            f"Scope violation: trajectory_id '{trajectory_id}' was provided but not found "
            f"in the query. When trajectory_id is given, the query must filter on trace_id. "
            f"If you need a cross-trace query, omit trajectory_id from the tool call arguments."
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

    violation = _validate_tenant_isolation(query, tenant_id, agent_id, trajectory_id)
    if violation:
        logger.warning("Tracy MCP security violation: %s", violation)
        return {
            "content": [{"type": "text", "text": violation}],
            "isError": True,
        }

    try:
        rows = await run_cypher(query, settings)
        result_text = json.dumps(rows, default=str)
        if len(result_text) > 100_000:
            result_text = result_text[:100_000] + "\n... [truncated — add LIMIT to your query]"
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
# MCP endpoint — Streamable HTTP (POST for JSON-RPC, GET for discovery)
# ---------------------------------------------------------------------------
@router.get("/tracy/mcp")
async def tracy_mcp_get() -> Response:
    """GET handler for MCP discovery probes."""
    return Response(
        content=json.dumps({
            "name": "ClawTrace Tracy MCP",
            "version": "1.0.0",
            "protocol": "MCP/2025-03-26",
            "transport": "streamable-http",
        }),
        media_type="application/json",
    )


@router.post("/tracy/mcp")
async def tracy_mcp(
    request: Request,
    settings: Settings = Depends(get_settings),
) -> Response:
    body = await request.json()
    method = body.get("method")
    req_id = body.get("id")

    # Notifications (no id) → 202 Accepted
    if req_id is None:
        return Response(status_code=202)

    if method == "initialize":
        return _jsonrpc_ok(req_id, SERVER_INFO)

    if method == "tools/list":
        return _jsonrpc_ok(req_id, {"tools": [MCP_TOOL]})

    if method == "tools/call":
        params = body.get("params", {})
        tool_name = params.get("name", "")
        arguments = params.get("arguments", {})
        result = await _handle_tool_call(tool_name, arguments, settings)
        return _jsonrpc_ok(req_id, result)

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
