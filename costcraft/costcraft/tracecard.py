"""Compile OpenClaw session JSONL → compact structured TraceCard.

OpenClaw writes a session record per agent run at
  ~/.openclaw/agents/main/sessions/{session_id}.jsonl

Each line is one of:
  - {type: session, ...}                    — session metadata
  - {type: model_change, ...}               — model selection
  - {type: thinking_level_change, ...}      — thinking level change
  - {type: custom, customType: ..., ...}    — plugin / bootstrap metadata
  - {type: message, message: {role, content, usage}}
      role ∈ {user, assistant, toolResult}
      content: list of {type: thinking|text|toolCall|toolResult, ...}
      usage: {input, output, cacheRead, cacheWrite, totalTokens, cost: {...}}

This is a richer signal than the ClawTrace plugin hooks — it already contains
per-call cost, tool call args/results, and thinking tokens.
"""
from __future__ import annotations
import copy
import json
from collections import defaultdict
from dataclasses import dataclass, asdict
from typing import Any

from rapidfuzz.distance import Levenshtein


@dataclass
class TraceCard:
    task_id: str
    model: str
    total_cost_usd: float
    total_tokens: dict
    llm_call_count: int
    tool_call_count: int
    top_cost_spans: list[dict]
    redundant_tool_calls: list[dict]
    sub_agents: list[dict]
    failed_or_repaired_steps: list[dict]

    def to_yaml_friendly(self) -> dict:
        return {
            "task_id": self.task_id,
            "model": self.model,
            "total_cost_usd": round(self.total_cost_usd, 4),
            "total_tokens": self.total_tokens,
            "llm_call_count": self.llm_call_count,
            "tool_call_count": self.tool_call_count,
            "top_cost_spans": self.top_cost_spans,
            "redundant_tool_calls": self.redundant_tool_calls,
            "sub_agents": self.sub_agents,
            "failed_or_repaired_steps": self.failed_or_repaired_steps,
        }


def _args_to_str(params: Any) -> str:
    try:
        return json.dumps(params, sort_keys=True, ensure_ascii=False)
    except Exception:
        return str(params)


def _cluster_tool_calls(tool_calls: list[dict]) -> list[dict]:
    """Group tool calls with ≥80% arg-string similarity per tool name."""
    buckets: dict[str, list[dict]] = defaultdict(list)
    for t in tool_calls:
        buckets[t.get("tool_name") or "?"].append(t)
    clusters = []
    for tool, calls in buckets.items():
        if len(calls) < 2:
            continue
        args_strs = [_args_to_str(c.get("args")) for c in calls]
        used = [False] * len(args_strs)
        for i, a in enumerate(args_strs):
            if used[i]:
                continue
            group = [i]
            used[i] = True
            for j in range(i + 1, len(args_strs)):
                if used[j]:
                    continue
                sim = Levenshtein.normalized_similarity(a, args_strs[j])
                if sim >= 0.8:
                    group.append(j)
                    used[j] = True
            if len(group) >= 2:
                clusters.append({
                    "tool": tool,
                    "count": len(group),
                    "args_sample": args_strs[group[0]][:220],
                })
    return clusters


def _jaccard_overlap(child_tail: str, parent_final: str) -> float:
    STOP = {"the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with",
            "is", "are", "was", "were", "be", "been", "being", "this", "that",
            "it", "its", "at", "by", "as", "from", "i", "we", "you"}
    def toks(s: str) -> set[str]:
        return {w for w in (s.lower().split()) if w.isalpha() and w not in STOP and len(w) > 2}
    a, b = toks(child_tail), toks(parent_final)
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def build_tracecard_from_session(
    *,
    task_id: str,
    session_records: list[dict],
    final_message: str = "",
    top_k: int = 6,
) -> TraceCard:
    primary_model: str | None = None
    total_tokens = {"input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0}
    total_cost = 0.0

    llm_spans: list[dict] = []
    tool_calls: list[dict] = []
    tool_results_by_id: dict[str, dict] = {}
    sub_agent_spawns: list[dict] = []
    failures: list[dict] = []

    # First pass: collect model from model_change
    for rec in session_records:
        if rec.get("type") == "model_change":
            primary_model = primary_model or f"{rec.get('provider')}/{rec.get('modelId')}"

    # Walk messages
    for idx, rec in enumerate(session_records):
        if rec.get("type") != "message":
            continue
        m = rec["message"]
        role = m.get("role")
        usage = m.get("usage") or {}
        content = m.get("content") or []
        if role == "assistant":
            ttl = (usage.get("cost") or {}).get("total") or 0.0
            total_cost += ttl
            for k in ("input", "output", "cacheRead", "cacheWrite"):
                total_tokens[k] += int(usage.get(k) or 0)
            # role hint from content
            has_text = any(isinstance(c, dict) and c.get("type") == "text" for c in content)
            has_tool = any(isinstance(c, dict) and c.get("type") == "toolCall" for c in content)
            has_thinking = any(isinstance(c, dict) and c.get("type") == "thinking" for c in content)
            role_hint = (
                "final_reply" if has_text and not has_tool else
                "plan_then_tool" if has_text and has_tool else
                "tool_call" if has_tool else
                "thinking_only" if has_thinking else
                "other"
            )
            # collect tool calls in this assistant turn
            turn_tool_calls: list[dict] = []
            for c in content:
                if not isinstance(c, dict):
                    continue
                if c.get("type") == "toolCall":
                    # OpenClaw session writes tool args under `arguments` (string JSON)
                    # with `partialJson` fallback; also accept common alternates.
                    raw_args = (
                        c.get("arguments")
                        or c.get("partialJson")
                        or c.get("input")
                        or c.get("args")
                        or c.get("params")
                    )
                    parsed_args = raw_args
                    if isinstance(raw_args, str):
                        try:
                            parsed_args = json.loads(raw_args)
                        except Exception:
                            parsed_args = raw_args  # keep as string
                    tc = {
                        "id": c.get("id") or c.get("toolCallId"),
                        "tool_name": c.get("name") or c.get("toolName") or c.get("tool"),
                        "args": parsed_args,
                        "assistant_step": idx,
                    }
                    tool_calls.append(tc)
                    turn_tool_calls.append(tc)
                    # Detect sub-agent spawns heuristically (Task / Agent tools)
                    tn = (tc.get("tool_name") or "").lower()
                    if tn in {"task", "agent", "subagent", "spawn_agent"}:
                        sub_agent_spawns.append({
                            "tool": tc.get("tool_name"),
                            "args_sample": _args_to_str(tc.get("args"))[:200],
                            "assistant_step": idx,
                        })
            llm_spans.append({
                "span_id": f"llm_{idx}",
                "model": primary_model or "unknown",
                "cost_usd": round(ttl, 5),
                "tokens": {
                    "input": int(usage.get("input") or 0),
                    "output": int(usage.get("output") or 0),
                    "cacheRead": int(usage.get("cacheRead") or 0),
                    "cacheWrite": int(usage.get("cacheWrite") or 0),
                },
                "role_hint": role_hint,
                "tool_calls_in_turn": [tc.get("tool_name") for tc in turn_tool_calls],
            })
        elif role == "toolResult":
            # pair with a prior toolCall by id if possible
            for c in content:
                if isinstance(c, dict):
                    rid = c.get("toolCallId") or c.get("id") or ""
                    err = c.get("error") or (c.get("isError") and c.get("text"))
                    if err:
                        failures.append({
                            "assistant_step": idx,
                            "tool_call_id": rid,
                            "error": (str(err)[:200]),
                        })
                    if rid:
                        tool_results_by_id[rid] = c

    # Rank LLM spans by cost
    sorted_spans = sorted(llm_spans, key=lambda s: s["cost_usd"], reverse=True)
    top_cost_spans = sorted_spans[:top_k]

    redundant = _cluster_tool_calls(tool_calls)

    # Sub-agent "usage" heuristic: if we saw Task/Agent tool calls, check whether their
    # returned text is reflected in the final assistant message.
    sub_agents = []
    for sa in sub_agent_spawns:
        # crude: look for tool results near this step
        step = sa["assistant_step"]
        child_tail = ""
        for rec in session_records[step:step + 3]:
            if rec.get("type") == "message" and rec["message"].get("role") == "toolResult":
                for c in rec["message"].get("content") or []:
                    if isinstance(c, dict) and c.get("text"):
                        child_tail = (c.get("text") or "")[-600:]
                        break
                if child_tail:
                    break
        overlap = _jaccard_overlap(child_tail, final_message)
        sub_agents.append({
            "tool": sa["tool"],
            "output_used_in_final_heuristic": round(overlap, 2),
            "_note": "heuristic: Jaccard overlap; not authoritative",
            "args_sample": sa["args_sample"],
        })

    return TraceCard(
        task_id=task_id,
        model=primary_model or "unknown",
        total_cost_usd=total_cost,
        total_tokens=total_tokens,
        llm_call_count=len(llm_spans),
        tool_call_count=len(tool_calls),
        top_cost_spans=top_cost_spans,
        redundant_tool_calls=redundant,
        sub_agents=sub_agents,
        failed_or_repaired_steps=failures[:10],
    )


# Backward-compat alias: original plugin-event API
def build_tracecard(
    *, task_id: str, events: list[dict], final_message: str = "", top_k: int = 6
) -> TraceCard:
    """Deprecated. Use build_tracecard_from_session for OpenClaw session format."""
    return build_tracecard_from_session(
        task_id=task_id, session_records=events, final_message=final_message, top_k=top_k
    )
