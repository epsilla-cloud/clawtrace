"""Load captured trace events from the local ingest JSONL files and normalize them."""
from __future__ import annotations
import json
from pathlib import Path
from typing import Any


def load_events(trace_dir: Path, trace_id: str) -> list[dict[str, Any]]:
    """Read all events for one trace_id from JSONL, sorted by tsMs."""
    path = trace_dir / f"{trace_id}.jsonl"
    if not path.exists():
        return []
    events: list[dict[str, Any]] = []
    with path.open() as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                events.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    events.sort(key=lambda e: e.get("tsMs", 0))
    return events


def build_span_tree(events: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    """Group events into spans keyed by spanId. Each span is a dict with:
        span_id, parent_span_id, event_type, payload, ts_ms
    """
    spans: dict[str, dict[str, Any]] = {}
    for ev in events:
        sid = ev.get("spanId")
        if not sid:
            continue
        span = spans.setdefault(sid, {
            "span_id": sid,
            "parent_span_id": ev.get("parentSpanId"),
            "event_type": ev.get("eventType"),
            "ts_ms": ev.get("tsMs"),
            "events": [],
        })
        span["events"].append(ev)
        # first-seen parent wins, update if missing
        if not span.get("parent_span_id"):
            span["parent_span_id"] = ev.get("parentSpanId")
    return spans


def children_of(spans: dict[str, dict[str, Any]], span_id: str) -> list[dict[str, Any]]:
    return [s for s in spans.values() if s.get("parent_span_id") == span_id]


def get_llm_spans(events: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Pair llm_before_call + llm_after_call into single LLM spans."""
    by_span: dict[str, dict[str, Any]] = {}
    for ev in events:
        et = ev.get("eventType")
        if et not in {"llm_before_call", "llm_after_call"}:
            continue
        sid = ev.get("spanId")
        if not sid:
            continue
        rec = by_span.setdefault(sid, {
            "span_id": sid,
            "parent_span_id": ev.get("parentSpanId"),
        })
        p = ev.get("payload") or {}
        if et == "llm_before_call":
            rec["before_ts_ms"] = ev.get("tsMs")
            rec["provider"] = p.get("provider")
            rec["model"] = p.get("model")
        else:
            rec["after_ts_ms"] = ev.get("tsMs")
            rec["provider"] = rec.get("provider") or p.get("provider")
            rec["model"] = rec.get("model") or p.get("model")
            rec["usage"] = p.get("usage") or {}
            rec["assistant_texts"] = p.get("assistantTexts") or []
    return list(by_span.values())


def get_tool_spans(events: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_span: dict[str, dict[str, Any]] = {}
    for ev in events:
        et = ev.get("eventType")
        if et not in {"tool_before_call", "tool_after_call"}:
            continue
        sid = ev.get("spanId")
        if not sid:
            continue
        rec = by_span.setdefault(sid, {
            "span_id": sid,
            "parent_span_id": ev.get("parentSpanId"),
        })
        p = ev.get("payload") or {}
        if et == "tool_before_call":
            rec["before_ts_ms"] = ev.get("tsMs")
            rec["tool_name"] = p.get("toolName")
            rec["params"] = p.get("params") or {}
        else:
            rec["after_ts_ms"] = ev.get("tsMs")
            rec["tool_name"] = rec.get("tool_name") or p.get("toolName")
            rec["result"] = p.get("result")
            rec["error"] = p.get("error")
            rec["duration_ms"] = p.get("durationMs")
    return list(by_span.values())


def get_subagent_events(events: list[dict[str, Any]]) -> list[dict[str, Any]]:
    result = []
    for ev in events:
        et = ev.get("eventType")
        if et in {"subagent_spawn", "subagent_join"}:
            result.append({
                "event_type": et,
                "span_id": ev.get("spanId"),
                "parent_span_id": ev.get("parentSpanId"),
                "ts_ms": ev.get("tsMs"),
                "payload": ev.get("payload") or {},
            })
    return result
