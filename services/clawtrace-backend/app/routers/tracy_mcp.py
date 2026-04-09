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
# Auth helper
# ---------------------------------------------------------------------------
def _verify_bearer(authorization: Optional[str], settings: Settings) -> None:
    if not authorization or not authorization.startswith("Bearer "):
        logger.warning("MCP auth failed: no Bearer header. Got: %s", authorization[:40] if authorization else None)
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = authorization[7:]
    if not hmac.compare_digest(token, settings.internal_secret):
        logger.warning("MCP auth failed: token mismatch. Got len=%d, expected len=%d, first8=%s",
                       len(token), len(settings.internal_secret), token[:8])
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
# OAuth 2.0 Authorization Code + PKCE flow (MCP Authorization spec)
#
# Anthropic's platform follows the full MCP OAuth spec:
#   1. GET /.well-known/oauth-protected-resource  → resource metadata
#   2. GET /.well-known/oauth-authorization-server → auth server metadata
#   3. POST /register                             → dynamic client registration
#   4. GET  /authorize                            → authorization (auto-approve)
#   5. POST /token                                → exchange code for access token
#
# Since ClawTrace uses static Bearer tokens (stored in the Anthropic vault),
# the OAuth flow auto-approves and returns a simple opaque token.
# ---------------------------------------------------------------------------
import secrets
import time as _time
from urllib.parse import urlencode, parse_qs, urlparse

# In-memory auth code store: code -> {client_id, redirect_uri, code_challenge, expires}
_auth_codes: dict[str, dict] = {}

_BASE = "https://api.clawtrace.ai"

_OAUTH_RESOURCE_META = {
    "resource": f"{_BASE}/tracy/mcp",
    "authorization_servers": [_BASE],
    "bearer_methods_supported": ["header"],
}

_OAUTH_AUTHZ_META = {
    "issuer": _BASE,
    "authorization_endpoint": f"{_BASE}/authorize",
    "token_endpoint": f"{_BASE}/token",
    "registration_endpoint": f"{_BASE}/register",
    "response_types_supported": ["code"],
    "grant_types_supported": ["authorization_code"],
    "code_challenge_methods_supported": ["S256"],
    "token_endpoint_auth_methods_supported": ["none"],
}


@router.get("/.well-known/oauth-protected-resource/tracy/mcp")
@router.get("/.well-known/oauth-protected-resource")
async def oauth_protected_resource() -> Response:
    return Response(
        content=json.dumps(_OAUTH_RESOURCE_META),
        media_type="application/json",
    )


@router.get("/.well-known/oauth-authorization-server")
async def oauth_authorization_server() -> Response:
    return Response(
        content=json.dumps(_OAUTH_AUTHZ_META),
        media_type="application/json",
    )


@router.post("/register")
async def oauth_register(request: Request) -> Response:
    """Dynamic client registration (RFC 7591)."""
    body = await request.json()
    return Response(
        content=json.dumps({
            "client_id": "clawtrace-tracy-" + secrets.token_hex(8),
            "client_name": body.get("client_name", "ClawTrace MCP Client"),
            "grant_types": ["authorization_code"],
            "token_endpoint_auth_method": "none",
            "redirect_uris": body.get("redirect_uris", []),
            "response_types": ["code"],
        }),
        media_type="application/json",
        status_code=201,
    )


@router.get("/authorize")
async def oauth_authorize(request: Request) -> Response:
    """Authorization endpoint — auto-approves and redirects back with auth code."""
    params = dict(request.query_params)
    redirect_uri = params.get("redirect_uri", "")
    state = params.get("state", "")
    client_id = params.get("client_id", "")
    code_challenge = params.get("code_challenge", "")

    if not redirect_uri:
        return Response(content="missing redirect_uri", status_code=400)

    # Generate auth code
    code = secrets.token_urlsafe(32)
    _auth_codes[code] = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "code_challenge": code_challenge,
        "expires": _time.time() + 300,  # 5 minutes
    }

    # Clean expired codes
    now = _time.time()
    expired = [k for k, v in _auth_codes.items() if v["expires"] < now]
    for k in expired:
        del _auth_codes[k]

    # Redirect back with code
    sep = "&" if "?" in redirect_uri else "?"
    location = f"{redirect_uri}{sep}" + urlencode({"code": code, "state": state})
    return Response(status_code=302, headers={"Location": location})


@router.post("/token")
async def oauth_token(request: Request, settings: Settings = Depends(get_settings)) -> Response:
    """Token endpoint — exchanges auth code for access token."""
    body = await request.form()
    grant_type = body.get("grant_type", "")
    code = body.get("code", "")

    if grant_type != "authorization_code" or not code:
        return Response(
            content=json.dumps({"error": "unsupported_grant_type"}),
            media_type="application/json",
            status_code=400,
        )

    entry = _auth_codes.pop(code, None)
    if not entry or entry["expires"] < _time.time():
        return Response(
            content=json.dumps({"error": "invalid_grant", "error_description": "code expired or invalid"}),
            media_type="application/json",
            status_code=400,
        )

    # Return the internal secret as the access token —
    # this is the same token the MCP endpoint validates against
    return Response(
        content=json.dumps({
            "access_token": settings.internal_secret,
            "token_type": "bearer",
            "expires_in": 86400 * 365,
        }),
        media_type="application/json",
    )


# ---------------------------------------------------------------------------
# MCP endpoint — Streamable HTTP
# ---------------------------------------------------------------------------
@router.get("/tracy/mcp")
async def tracy_mcp_get() -> Response:
    """GET handler for MCP discovery / SSE probe."""
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
    authorization: Optional[str] = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> Response:
    body = await request.json()
    method = body.get("method")
    req_id = body.get("id")

    # Notifications (no id) → 202 Accepted
    if req_id is None:
        return Response(status_code=202)

    # initialize — no auth required (allows platform discovery)
    if method == "initialize":
        return _jsonrpc_ok(req_id, SERVER_INFO)

    # tools/list — no auth required (tool definitions are not secret)
    if method == "tools/list":
        return _jsonrpc_ok(req_id, {"tools": [MCP_TOOL]})

    # All other methods require auth
    _verify_bearer(authorization, settings)

    # tools/call — auth required (executes real queries)
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
