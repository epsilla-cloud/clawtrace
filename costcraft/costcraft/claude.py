"""Thin wrapper around claude-agent-sdk for one-shot LLM calls.

Authenticates through the user's local Claude Code install (no API key needed).
Used for refinement and LLM-judge grading. Disables all tools — we only want
text completion, not agentic tool use.
"""
from __future__ import annotations
import asyncio
from dataclasses import dataclass

from claude_agent_sdk import (
    query,
    ClaudeAgentOptions,
    AssistantMessage,
    ResultMessage,
)


@dataclass
class ClaudeResponse:
    text: str
    input_tokens: int
    output_tokens: int
    cache_read_tokens: int
    cache_creation_tokens: int
    total_cost_usd: float
    model: str
    duration_ms: int


async def aoneshot(
    *,
    user: str,
    system: str | None = None,
    max_turns: int = 1,
    model: str | None = None,
) -> ClaudeResponse:
    """Single-turn, tool-disabled call. Returns text + usage + cost."""
    text_parts: list[str] = []
    usage: dict = {}
    cost: float = 0.0
    observed_model: str = ""
    duration_ms: int = 0

    options_kwargs = {
        "allowed_tools": [],
        "max_turns": max_turns,
        "setting_sources": [],  # don't inherit user/project settings
    }
    if system is not None:
        options_kwargs["system_prompt"] = system
    if model is not None:
        options_kwargs["model"] = model

    async for m in query(prompt=user, options=ClaudeAgentOptions(**options_kwargs)):
        if isinstance(m, AssistantMessage):
            for block in m.content:
                if hasattr(block, "text"):
                    text_parts.append(block.text)
            observed_model = observed_model or (m.model or "")
        elif isinstance(m, ResultMessage):
            usage = dict(m.usage or {})
            cost = float(m.total_cost_usd or 0.0)
            duration_ms = int(m.duration_ms or 0)

    return ClaudeResponse(
        text="".join(text_parts).strip(),
        input_tokens=int(usage.get("input_tokens") or 0),
        output_tokens=int(usage.get("output_tokens") or 0),
        cache_read_tokens=int(usage.get("cache_read_input_tokens") or 0),
        cache_creation_tokens=int(usage.get("cache_creation_input_tokens") or 0),
        total_cost_usd=cost,
        model=observed_model,
        duration_ms=duration_ms,
    )


def oneshot(
    *,
    user: str,
    system: str | None = None,
    max_turns: int = 1,
    model: str | None = None,
) -> ClaudeResponse:
    """Sync wrapper."""
    return asyncio.run(aoneshot(user=user, system=system, max_turns=max_turns, model=model))
