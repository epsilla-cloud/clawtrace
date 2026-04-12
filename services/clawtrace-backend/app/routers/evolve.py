"""
POST /v1/evolve/ask — Self-evolving endpoint for OpenClaw agents.

OpenClaw authenticates with the same observe key used for ingestion.
The observe key encodes {apiKey, tenantId, agentId}. This endpoint
lets an OpenClaw agent ask Tracy questions about its own trajectories
and receive structured analysis and recommendations.

This closes the self-evolving loop:
  OpenClaw runs → ClawTrace captures trajectory
  → OpenClaw calls /v1/evolve/ask
  → Tracy analyzes live trajectory data
  → OpenClaw improves its next run
"""
from __future__ import annotations

import asyncio
import json
import logging
import threading
import time as _time
from typing import Any, Optional

import anthropic
from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ..auth import get_settings
from ..config import Settings
from ..database import validate_api_key
from ..deficit_guard import DeficitGuard
from ..routers.tracy import _build_context_prefix, _stream_tracy, _sse_event, _persist_conversation

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/v1/evolve", tags=["evolve"])

BETAS = ["managed-agents-2026-04-01"]


class EvolveRequest(BaseModel):
    question: str
    trace_id: Optional[str] = None
    local_context: Optional[dict] = None
    session_id: Optional[str] = None


async def _authenticate_observe_key(
    authorization: Optional[str],
    settings: Settings,
) -> dict[str, str]:
    """Validate observe key and return {tenant_id, agent_id}."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="observe key required")
    raw = authorization[7:]
    result = await validate_api_key(raw, settings)
    if not result.valid or not result.tenant_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid observe key")
    return {"tenant_id": result.tenant_id, "key_id": result.key_id or ""}


@router.post("/ask")
async def evolve_ask(
    body: EvolveRequest,
    request: Request,
    authorization: Optional[str] = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> StreamingResponse:
    """
    Ask Tracy a question about your OpenClaw trajectories.
    Authenticate with the same observe key used for trace ingestion.

    Request body:
      question    (required) — e.g. "Why did my last run cost so much?"
      trace_id    (optional) — scope to a specific trace
      local_context (optional) — extra JSON context from your agent
      session_id  (optional) — continue a previous conversation

    Returns: SSE stream of Tracy's analysis.
    Events: session, text, tool_use, tool_result, thinking, done, error
    """
    # Authenticate with observe key
    identity = await _authenticate_observe_key(authorization, settings)
    tenant_id = identity["tenant_id"]

    # Deficit check
    await request.app.state.deficit_guard.check(tenant_id)

    if not settings.anthropic_api_key or not settings.tracy_agent_id:
        return StreamingResponse(
            iter([_sse_event("error", {"message": "Tracy is not configured"})]),
            media_type="text/event-stream",
        )

    # Build context — we know agent_id from key lookup (key_id IS the agent_id in api_keys)
    agent_id = identity["key_id"]
    context_prefix = _build_context_prefix(
        tenant_id=tenant_id,
        user_name="OpenClaw Agent",
        agent_id=agent_id or None,
        trace_id=body.trace_id,
        local_context=body.local_context,
    )

    collected: dict[str, Any] = {}
    main_loop = asyncio.get_event_loop()

    def streaming_with_persist():
        yield from _stream_tracy(
            message=body.question,
            context_prefix=context_prefix,
            session_id=body.session_id,
            settings=settings,
            collected=collected,
        )
        try:
            future = asyncio.run_coroutine_threadsafe(
                _persist_conversation(
                    user_id=tenant_id,
                    raw_message=body.question,
                    agent_id=agent_id or None,
                    trace_id=body.trace_id,
                    collected=collected,
                    settings=settings,
                ),
                main_loop,
            )
            future.result(timeout=10)
        except Exception:
            logger.exception("Failed to persist evolve conversation")

    return StreamingResponse(
        streaming_with_persist(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
