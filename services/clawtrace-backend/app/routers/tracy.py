"""
Tracy chat API — streams Anthropic managed agent responses via SSE.

The UI sends:
  - message: the user's question
  - agent_id (optional): scopes to a specific agent (dashboard page)
  - trace_id (optional): scopes to a specific trace (trace detail page)
  - local_context (optional): JSON of page-loaded data for extra context
  - session_id (optional): reuse an existing Tracy session

The backend:
  1. Extracts tenant_id from the JWT
  2. Assembles a prompt combining: user question + tenant/agent/trace scope + page context
  3. Creates or reuses an Anthropic managed agent session
  4. Streams events back as SSE (text, tool calls, reasoning, status)
"""
from __future__ import annotations

import json
import logging
import threading
import time as _time
from typing import Optional

import anthropic
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ..auth import get_current_user, get_settings
from ..config import Settings
from ..models import UserSession

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/v1/tracy", tags=["tracy"])

BETAS = ["managed-agents-2026-04-01"]


# ---------------------------------------------------------------------------
# Request model
# ---------------------------------------------------------------------------
class ChatRequest(BaseModel):
    message: str
    agent_id: Optional[str] = None
    trace_id: Optional[str] = None
    local_context: Optional[dict] = None
    session_id: Optional[str] = None


# ---------------------------------------------------------------------------
# Prompt assembly
# ---------------------------------------------------------------------------
def _build_context_prefix(
    tenant_id: str,
    user_name: str,
    agent_id: Optional[str],
    trace_id: Optional[str],
    local_context: Optional[dict],
) -> str:
    """Build a context block that precedes the user's question."""
    parts: list[str] = []

    parts.append(f"Tenant ID: {tenant_id}")
    parts.append(f"User: {user_name}")

    if agent_id:
        parts.append(f"Current page: Agent dashboard (agent_id: {agent_id})")
        parts.append("Scope: queries should focus on this agent's trajectories and spans.")
    elif trace_id:
        parts.append(f"Current page: Trace detail (trace_id: {trace_id})")
        parts.append("Scope: queries should focus on this specific trace and its spans.")
    else:
        parts.append("Current page: General (no specific agent or trace selected)")

    if local_context:
        # Truncate to avoid blowing up context
        ctx_str = json.dumps(local_context, default=str)
        if len(ctx_str) > 20_000:
            ctx_str = ctx_str[:20_000] + "... [truncated]"
        parts.append(f"Page data:\n{ctx_str}")

    return "\n".join(parts)


# ---------------------------------------------------------------------------
# SSE streaming generator
# ---------------------------------------------------------------------------
def _stream_tracy(
    message: str,
    context_prefix: str,
    session_id: Optional[str],
    settings: Settings,
):
    """Create/reuse a managed agent session and yield SSE events.
    Sync generator — FastAPI runs it in a threadpool so blocking SDK calls work."""
    try:
        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

        # Create or reuse session
        if session_id:
            sid = session_id
        else:
            session = client.beta.sessions.create(
                agent={"type": "agent", "id": settings.tracy_agent_id},
                environment_id=settings.tracy_environment_id,
                betas=BETAS,
            )
            sid = session.id
            yield _sse_event("session", {"session_id": sid})

        # Compose the full message with context
        full_message = f"<context>\n{context_prefix}\n</context>\n\n{message}"

        # Send the user message in a separate thread because
        # events.stream() blocks on iteration and events.send() also blocks.
        def _send():
            _time.sleep(0.5)
            client.beta.sessions.events.send(
                session_id=sid,
                events=[
                    {
                        "type": "user.message",
                        "content": [{"type": "text", "text": full_message}],
                    },
                ],
                betas=BETAS,
            )

        sender = threading.Thread(target=_send, daemon=True)
        sender.start()

        with client.beta.sessions.events.stream(
            session_id=sid,
            betas=BETAS,
        ) as stream:

            for event in stream:
                etype = event.type
                if etype == "agent.message":
                    for block in event.content:
                        if hasattr(block, "text"):
                            yield _sse_event("text", {"text": block.text})
                elif etype == "agent.message_delta":
                    if hasattr(event, "delta") and hasattr(event.delta, "text"):
                        yield _sse_event("text_delta", {"text": event.delta.text})
                elif etype == "agent.tool_use":
                    yield _sse_event("tool_use", {
                        "tool": event.name,
                        "input": event.input if hasattr(event, "input") else {},
                    })
                elif etype == "agent.tool_result":
                    content_text = ""
                    if hasattr(event, "content"):
                        for block in event.content:
                            if hasattr(block, "text"):
                                content_text += block.text
                    if len(content_text) > 5000:
                        content_text = content_text[:5000] + "... [truncated]"
                    yield _sse_event("tool_result", {"text": content_text})
                elif etype == "agent.thinking":
                    if hasattr(event, "text"):
                        yield _sse_event("thinking", {"text": event.text})
                elif etype == "session.status_idle":
                    yield _sse_event("done", {"status": "idle"})
                    break
                elif etype == "error":
                    msg = str(event.error) if hasattr(event, "error") else "Unknown error"
                    yield _sse_event("error", {"message": msg})
                    break
                else:
                    logger.debug("Tracy SSE unknown event: %s", etype)

        yield _sse_event("done", {"status": "complete"})

    except Exception as exc:
        logger.exception("Tracy chat stream error")
        yield _sse_event("error", {"message": str(exc)})


def _sse_event(event_type: str, data: dict) -> str:
    """Format a Server-Sent Event."""
    payload = json.dumps({"type": event_type, **data})
    return f"event: {event_type}\ndata: {payload}\n\n"


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------
@router.post("/chat")
async def tracy_chat(
    body: ChatRequest,
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
) -> StreamingResponse:
    if not settings.anthropic_api_key or not settings.tracy_agent_id:
        return StreamingResponse(
            iter([_sse_event("error", {"message": "Tracy is not configured"})]),
            media_type="text/event-stream",
        )

    context_prefix = _build_context_prefix(
        tenant_id=session.db_id,
        user_name=session.name,
        agent_id=body.agent_id,
        trace_id=body.trace_id,
        local_context=body.local_context,
    )

    return StreamingResponse(
        _stream_tracy(
            message=body.message,
            context_prefix=context_prefix,
            session_id=body.session_id,
            settings=settings,
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
