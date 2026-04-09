"""
Tracy chat API — streams Anthropic managed agent responses via SSE.

The UI sends:
  - message: the user's question
  - agent_id (optional): scopes to a specific agent (dashboard page)
  - trace_id (optional): scopes to a specific trace (trace detail page)
  - local_context (optional): JSON of page-loaded data for extra context
  - session_id (optional): reuse an existing Tracy conversation

The backend:
  1. Extracts tenant_id from the JWT
  2. Assembles a prompt combining: user question + tenant/agent/trace scope + page context
  3. Creates or reuses an Anthropic managed agent session
  4. Streams events back as SSE (text, tool calls, reasoning, status)
  5. Saves both user message and assistant response to Neon DB
"""
from __future__ import annotations

import asyncio
import json
import logging
import threading
import time as _time
from typing import Any, Optional

import anthropic
from fastapi import APIRouter, Depends, Query, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ..auth import get_current_user, get_settings
from ..config import Settings
from ..consumption import report_consumption
from ..database import (
    create_tracy_session,
    delete_tracy_session,
    get_tracy_messages,
    get_tracy_session_by_harness_id,
    list_tracy_sessions,
    save_tracy_message,
)
from ..models import UserSession

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/v1/tracy", tags=["tracy"])

BETAS = ["managed-agents-2026-04-01"]


# ---------------------------------------------------------------------------
# Request / response models
# ---------------------------------------------------------------------------
class ChatRequest(BaseModel):
    message: str
    agent_id: Optional[str] = None
    trace_id: Optional[str] = None
    local_context: Optional[dict] = None
    session_id: Optional[str] = None          # harness session ID to continue


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
    parts: list[str] = []
    parts.append(f"Tenant ID: {tenant_id}")
    parts.append(f"User: {user_name}")

    if trace_id and agent_id:
        parts.append(f"Current page: Trajectory detail")
        parts.append(f"agent_id: {agent_id}")
        parts.append(f"trace_id: {trace_id}")
        parts.append("")
        parts.append("SCOPE CONSTRAINT (MANDATORY):")
        parts.append(f"- You MUST pass agent_id='{agent_id}' AND trajectory_id='{trace_id}' in every run_cypher_query tool call.")
        parts.append(f"- Every Cypher query MUST include WHERE filters on both agent_id='{agent_id}' AND trace_id='{trace_id}'.")
        parts.append("- Focus ONLY on this specific trajectory's spans, tokens, duration, and errors.")
        parts.append("- Do NOT query other traces or aggregate across the agent unless the user explicitly asks to compare.")
    elif agent_id:
        parts.append(f"Current page: Agent dashboard")
        parts.append(f"agent_id: {agent_id}")
        parts.append("")
        parts.append("SCOPE CONSTRAINT (MANDATORY):")
        parts.append(f"- You MUST pass agent_id='{agent_id}' in every run_cypher_query tool call.")
        parts.append(f"- Every Cypher query MUST include WHERE t.agent_id='{agent_id}' (or s.agent_id for span queries).")
        parts.append("- Focus ONLY on this agent's trajectories and spans.")
        parts.append("- Do NOT query other agents unless the user explicitly asks to compare.")
    else:
        parts.append("Current page: General (no specific agent or trace selected)")
        parts.append("")
        parts.append("SCOPE: You may query across all agents and traces for this tenant.")

    if local_context:
        ctx_str = json.dumps(local_context, default=str)
        if len(ctx_str) > 20_000:
            ctx_str = ctx_str[:20_000] + "... [truncated]"
        parts.append(f"\nPage data:\n{ctx_str}")

    return "\n".join(parts)


def _page_scope(agent_id: Optional[str], trace_id: Optional[str]) -> str:
    if trace_id:
        return "trace_detail"
    if agent_id:
        return "agent_dashboard"
    return "general"


# ---------------------------------------------------------------------------
# SSE streaming generator — collects events for DB persistence
# ---------------------------------------------------------------------------
def _stream_tracy(
    message: str,
    context_prefix: str,
    session_id: Optional[str],
    settings: Settings,
    collected: dict,
):
    """Sync generator — FastAPI runs it in a threadpool.
    `collected` is mutated in-place to capture data for DB persistence."""
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

        collected["harness_session_id"] = sid

        full_message = f"<context>\n{context_prefix}\n</context>\n\n{message}"
        collected["context_message"] = full_message

        # Send the user message in a background thread
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

        text_parts: list[str] = []
        reasoning_steps: list[dict] = []

        with client.beta.sessions.events.stream(
            session_id=sid,
            betas=BETAS,
        ) as stream:
            for event in stream:
                etype = event.type
                if etype == "agent.message":
                    for block in event.content:
                        if hasattr(block, "text"):
                            text_parts.append(block.text)
                            yield _sse_event("text", {"text": block.text})
                elif etype == "agent.mcp_tool_use":
                    tool_name = getattr(event, "name", "")
                    step = {
                        "type": "tool_use",
                        "tool": tool_name,
                        "server": getattr(event, "mcp_server_name", ""),
                    }
                    reasoning_steps.append(step)
                    yield _sse_event("tool_use", step)
                    # Send a descriptive thinking label so UI shows what's happening
                    yield _sse_event("thinking", {"text": f"Querying trajectory data..."})
                elif etype == "agent.mcp_tool_result":
                    content_text = ""
                    is_error = getattr(event, "is_error", False)
                    if hasattr(event, "content"):
                        for block in event.content:
                            if hasattr(block, "text"):
                                content_text += block.text
                    if len(content_text) > 5000:
                        content_text = content_text[:5000] + "... [truncated]"
                    step = {"type": "tool_result", "text": content_text, "is_error": is_error}
                    reasoning_steps.append(step)
                    yield _sse_event("tool_result", step)
                    yield _sse_event("thinking", {"text": "Interpreting results..."})
                elif etype == "agent.thinking":
                    reasoning_steps.append({"type": "thinking", "text": ""})
                elif etype == "span.model_request_start":
                    yield _sse_event("thinking", {"text": "Reasoning about your question..."})
                elif etype == "span.model_request_end":
                    # Extract token usage
                    if hasattr(event, "model_usage"):
                        u = event.model_usage
                        inp = getattr(u, "input_tokens", 0) or 0
                        out = getattr(u, "output_tokens", 0) or 0
                        cache_create = getattr(u, "cache_creation_input_tokens", 0) or 0
                        cache_read = getattr(u, "cache_read_input_tokens", 0) or 0
                        collected["input_tokens"] = collected.get("input_tokens", 0) + inp + cache_create + cache_read
                        collected["output_tokens"] = collected.get("output_tokens", 0) + out
                        logger.info(
                            "Tracy tokens: input=%d (cache_create=%d, cache_read=%d, direct=%d), output=%d",
                            inp + cache_create + cache_read, cache_create, cache_read, inp, out,
                        )
                elif etype == "session.status_idle":
                    yield _sse_event("done", {
                        "status": "idle",
                        "input_tokens": collected.get("input_tokens", 0),
                        "output_tokens": collected.get("output_tokens", 0),
                    })
                    break
                elif etype == "session.error" or etype == "error":
                    msg = str(event) if not hasattr(event, "error") else str(event.error)
                    reasoning_steps.append({"type": "error", "message": msg})
                    yield _sse_event("error", {"message": msg})
                elif etype in ("session.status_running", "user.message"):
                    pass  # expected, no action
                else:
                    logger.debug("Tracy SSE event: %s", etype)

        collected["response_text"] = "\n".join(text_parts)
        collected["reasoning_steps"] = reasoning_steps
        yield _sse_event("done", {"status": "complete"})

    except Exception as exc:
        logger.exception("Tracy chat stream error")
        yield _sse_event("error", {"message": str(exc)})
        collected["response_text"] = f"Error: {exc}"


def _sse_event(event_type: str, data: dict) -> str:
    payload = json.dumps({"type": event_type, **data}, default=str)
    return f"event: {event_type}\ndata: {payload}\n\n"


# ---------------------------------------------------------------------------
# Background task: save conversation to DB after stream completes
# ---------------------------------------------------------------------------
async def _persist_conversation(
    user_id: str,
    raw_message: str,
    agent_id: Optional[str],
    trace_id: Optional[str],
    collected: dict,
    settings: Settings,
):
    """Save user message + assistant response to the DB."""
    try:
        harness_sid = collected.get("harness_session_id", "")
        if not harness_sid:
            return

        # Find or create DB session
        existing = await get_tracy_session_by_harness_id(harness_sid, user_id, settings)
        if existing:
            db_session_id = str(existing["id"])
        else:
            db_session_id = await create_tracy_session(
                user_id=user_id,
                harness_session_id=harness_sid,
                page_scope=_page_scope(agent_id, trace_id),
                agent_id=agent_id,
                trace_id=trace_id,
                settings=settings,
            )

        # Save user message
        await save_tracy_message(
            session_id=db_session_id,
            role="user",
            raw_message=raw_message,
            context_message=collected.get("context_message"),
            response_text=None,
            reasoning_steps=None,
            input_tokens=None,
            output_tokens=None,
            metadata=None,
            settings=settings,
        )

        # Save assistant response
        await save_tracy_message(
            session_id=db_session_id,
            role="assistant",
            raw_message=None,
            context_message=None,
            response_text=collected.get("response_text"),
            reasoning_steps=collected.get("reasoning_steps"),
            input_tokens=collected.get("input_tokens"),
            output_tokens=collected.get("output_tokens"),
            metadata=None,
            settings=settings,
        )

        # Report token consumption to payment service
        inp = collected.get("input_tokens", 0) or 0
        out = collected.get("output_tokens", 0) or 0
        if inp > 0 or out > 0:
            items: dict[str, float] = {}
            if inp > 0:
                items["tracy_input_token_1k"] = inp / 1000.0
            if out > 0:
                items["tracy_output_token_1k"] = out / 1000.0
            await report_consumption(user_id, items, settings)
            logger.info("Tracy consumption reported: tenant=%s input=%d output=%d", user_id, inp, out)

        logger.info("Tracy conversation saved: session=%s", db_session_id)

    except Exception:
        logger.exception("Failed to persist Tracy conversation")


# ---------------------------------------------------------------------------
# Chat endpoint
# ---------------------------------------------------------------------------
@router.post("/chat")
async def tracy_chat(
    body: ChatRequest,
    request: Request,
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
) -> StreamingResponse:
    # Deficit check — block Tracy chat if credits exhausted
    await request.app.state.deficit_guard.check(session.db_id)

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

    # Shared dict — mutated by the generator, read by persistence task
    collected: dict[str, Any] = {}

    # Grab the main event loop before entering the threadpool
    main_loop = asyncio.get_event_loop()

    def streaming_with_persist():
        """Yield SSE events, then trigger DB persistence on the main event loop."""
        yield from _stream_tracy(
            message=body.message,
            context_prefix=context_prefix,
            session_id=body.session_id,
            settings=settings,
            collected=collected,
        )
        # Schedule persistence on the main event loop (where asyncpg pool lives)
        try:
            future = asyncio.run_coroutine_threadsafe(
                _persist_conversation(
                    user_id=session.db_id,
                    raw_message=body.message,
                    agent_id=body.agent_id,
                    trace_id=body.trace_id,
                    collected=collected,
                    settings=settings,
                ),
                main_loop,
            )
            future.result(timeout=10)  # wait up to 10s for persistence
        except Exception:
            logger.exception("Failed to persist Tracy conversation")

    return StreamingResponse(
        streaming_with_persist(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


# ---------------------------------------------------------------------------
# History endpoints
# ---------------------------------------------------------------------------
@router.get("/sessions")
async def tracy_sessions(
    limit: int = Query(20, ge=1, le=100),
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
):
    sessions = await list_tracy_sessions(session.db_id, settings, limit)
    return {"sessions": sessions}


@router.get("/sessions/{session_id}/messages")
async def tracy_session_messages(
    session_id: str,
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
):
    messages = await get_tracy_messages(session_id, session.db_id, settings)
    return {"messages": messages}


@router.delete("/sessions/{session_id}")
async def tracy_delete_session(
    session_id: str,
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
):
    deleted = await delete_tracy_session(session_id, session.db_id, settings)
    return {"deleted": deleted}
