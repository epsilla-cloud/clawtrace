"""
Traces API — backed by PuppyGraph Cypher queries via POST /submitCypher.

Schema facts (from puppygraph/schema.json):
  Trace vertex  id=trace_id, attributes: tenant_id, agent_id,
                trace_start_ts_ms, trace_end_ts_ms, duration_ms,
                event_count, trace_date
  Span  vertex  id=span_id,  attributes: tenant_id, agent_id, trace_id,
                total_tokens, input_tokens, output_tokens, cost_usd, has_error
  Edges: Agent-[:OWNS]->Trace, Trace-[:HAS_SPAN]->Span

Rules confirmed by testing:
  - elementId(v) returns "Label[uuid]"   ← use for vertex identity
  - v.attribute  works for non-id fields ← use for filtering/aggregation
  - v.id_field   does NOT work           ← never use a.agent_id on Agent
"""
from __future__ import annotations

import time
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from ..auth import get_current_user, get_settings
from ..config import Settings
from ..database import get_pool
from ..models import UserSession
from ..puppygraph import run_cypher

router = APIRouter(prefix="/v1/traces", tags=["traces"])

MS_PER_DAY = 86_400_000


def _default_range() -> tuple[int, int]:
    now = int(time.time() * 1000)
    return now - 7 * MS_PER_DAY, now


# ── Response models ───────────────────────────────────────────────────────────

class TraceMetrics(BaseModel):
    total_traces: int
    total_tokens: int
    total_cost_usd: float
    success_rate: float


class TrendPoint(BaseModel):
    date: str
    run_count: int
    cost_usd: float


class TraceRow(BaseModel):
    trace_id: str
    started_at_ms: Optional[int] = None
    duration_ms: Optional[int] = None
    event_count: Optional[int] = None
    total_tokens: int = 0
    input_tokens: int = 0
    output_tokens: int = 0
    cost_usd: float = 0.0
    has_error: int = 0


class TracesResponse(BaseModel):
    metrics: TraceMetrics
    trends: list[TrendPoint]
    traces: list[TraceRow]


# ── Auth helper — check Neon DB (fast, no PuppyGraph round-trip) ──────────────

async def _verify_agent_ownership(
    agent_id: str, tenant_id: str, settings: Settings
) -> None:
    pool = await get_pool(settings)
    row = await pool.fetchrow(
        "SELECT id FROM api_keys WHERE id=$1 AND user_id=$2 AND revoked=FALSE",
        UUID(agent_id), UUID(tenant_id),
    )
    if not row:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="agent not found for this tenant",
        )


def _safe_int(v: object) -> int:
    try:
        return int(v) if v is not None else 0
    except (TypeError, ValueError):
        return 0


def _safe_float(v: object) -> float:
    try:
        return float(v) if v is not None else 0.0
    except (TypeError, ValueError):
        return 0.0


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.get("", response_model=TracesResponse)
async def get_traces(
    agent_id: str = Query(...),
    from_ms: Optional[int] = Query(None),
    to_ms: Optional[int] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
) -> TracesResponse:
    tid = session.db_id
    await _verify_agent_ownership(agent_id, tid, settings)

    _from, _to = _default_range()
    from_ms = from_ms or _from
    to_ms   = to_ms   or _to

    # ── 1. Metrics ────────────────────────────────────────────────────────────
    # Filter Trace by agent_id + tenant_id attributes (both are non-id attrs)
    metrics_q = f"""
MATCH (t:Trace)
WHERE t.agent_id   = '{agent_id}'
  AND t.tenant_id  = '{tid}'
  AND t.trace_start_ts_ms >= {from_ms}
  AND t.trace_start_ts_ms <= {to_ms}
OPTIONAL MATCH (t)-[:HAS_SPAN]->(s:Span)
RETURN
  count(DISTINCT elementId(t))                          AS total_traces,
  coalesce(sum(s.total_tokens), 0)                      AS total_tokens,
  coalesce(sum(s.cost_usd), 0.0)                        AS total_cost,
  sum(CASE WHEN s.has_error = 1 THEN 1 ELSE 0 END)      AS error_spans
"""
    m_rows = await run_cypher(metrics_q, settings)
    m = m_rows[0] if m_rows else {}
    total_traces = _safe_int(m.get("total_traces", 0))
    error_spans  = _safe_int(m.get("error_spans", 0))
    success_rate = round(
        1.0 - min(error_spans, total_traces) / total_traces, 4
    ) if total_traces else 1.0

    metrics = TraceMetrics(
        total_traces=total_traces,
        total_tokens=_safe_int(m.get("total_tokens", 0)),
        total_cost_usd=_safe_float(m.get("total_cost", 0.0)),
        success_rate=success_rate,
    )

    # ── 2. Trends (per day) ───────────────────────────────────────────────────
    trends_q = f"""
MATCH (t:Trace)
WHERE t.agent_id  = '{agent_id}'
  AND t.tenant_id = '{tid}'
  AND t.trace_start_ts_ms >= {from_ms}
  AND t.trace_start_ts_ms <= {to_ms}
OPTIONAL MATCH (t)-[:HAS_SPAN]->(s:Span)
RETURN
  t.trace_date                         AS date,
  count(DISTINCT elementId(t))         AS run_count,
  coalesce(sum(s.cost_usd), 0.0)       AS cost_usd
ORDER BY date
"""
    t_rows = await run_cypher(trends_q, settings)
    trends = [
        TrendPoint(
            date=str(r.get("date", "")),
            run_count=_safe_int(r.get("run_count", 0)),
            cost_usd=_safe_float(r.get("cost_usd", 0.0)),
        )
        for r in t_rows if r.get("date")
    ]

    # ── 3. Trace list ─────────────────────────────────────────────────────────
    traces_q = f"""
MATCH (t:Trace)
WHERE t.agent_id  = '{agent_id}'
  AND t.tenant_id = '{tid}'
  AND t.trace_start_ts_ms >= {from_ms}
  AND t.trace_start_ts_ms <= {to_ms}
OPTIONAL MATCH (t)-[:HAS_SPAN]->(s:Span)
RETURN
  elementId(t)                              AS trace_id,
  t.trace_start_ts_ms                       AS started_at_ms,
  t.duration_ms                             AS duration_ms,
  t.event_count                             AS event_count,
  coalesce(sum(s.input_tokens),  0)         AS input_tokens,
  coalesce(sum(s.output_tokens), 0)         AS output_tokens,
  coalesce(sum(s.total_tokens),  0)         AS total_tokens,
  coalesce(sum(s.cost_usd),      0.0)       AS cost_usd,
  max(coalesce(s.has_error,      0))        AS has_error
ORDER BY started_at_ms DESC
LIMIT {limit}
"""
    tr_rows = await run_cypher(traces_q, settings)
    traces = [
        TraceRow(
            trace_id=str(r.get("trace_id", "")),
            started_at_ms=r.get("started_at_ms"),
            duration_ms=r.get("duration_ms"),
            event_count=r.get("event_count"),
            input_tokens=_safe_int(r.get("input_tokens", 0)),
            output_tokens=_safe_int(r.get("output_tokens", 0)),
            total_tokens=_safe_int(r.get("total_tokens", 0)),
            cost_usd=_safe_float(r.get("cost_usd", 0.0)),
            has_error=_safe_int(r.get("has_error", 0)),
        )
        for r in tr_rows
    ]

    return TracesResponse(metrics=metrics, trends=trends, traces=traces)


# ── Trace detail ──────────────────────────────────────────────────────────────

class SpanDetail(BaseModel):
    span_id: str            # elementId format: Span[uuid]
    parent_span_id: Optional[str] = None   # uuid only (attribute)
    actor_type: str = "session"
    actor_label: str = ""
    span_start_ts_ms: Optional[int] = None
    span_end_ts_ms: Optional[int] = None
    duration_ms: int = 0
    input_tokens: int = 0
    output_tokens: int = 0
    total_tokens: int = 0
    cost_usd: float = 0.0
    has_error: int = 0


class TraceMeta(BaseModel):
    trace_id: str
    agent_id: Optional[str] = None
    trace_start_ts_ms: Optional[int] = None
    trace_end_ts_ms: Optional[int] = None
    duration_ms: int = 0
    event_count: int = 0


class TraceDetailResponse(BaseModel):
    meta: TraceMeta
    spans: list[SpanDetail]


@router.get("/{trace_id}", response_model=TraceDetailResponse)
async def get_trace_detail(
    trace_id: str,
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
) -> TraceDetailResponse:
    """
    Return metadata and all spans for a single trace.

    Optimised: spans are queried via direct attribute filter on s.trace_id
    (no edge traversal needed — trace_id is stored as an attribute on Span).
    Tenant ownership verified by including tenant_id in the WHERE clause.
    """
    tid  = session.db_id
    eid  = f"Trace[{trace_id}]"

    # 1. Trace metadata — single vertex lookup by elementId
    meta_q = f"""
MATCH (t:Trace)
WHERE elementId(t) = '{eid}'
  AND t.tenant_id  = '{tid}'
RETURN elementId(t)        AS trace_id,
       t.agent_id           AS agent_id,
       t.trace_start_ts_ms  AS trace_start_ts_ms,
       t.trace_end_ts_ms    AS trace_end_ts_ms,
       t.duration_ms        AS duration_ms,
       t.event_count        AS event_count
"""
    meta_rows = await run_cypher(meta_q, settings)
    if not meta_rows:
        raise HTTPException(status_code=404, detail="trace not found")

    m = meta_rows[0]
    meta = TraceMeta(
        trace_id=str(m.get("trace_id", eid)),
        agent_id=m.get("agent_id"),
        trace_start_ts_ms=m.get("trace_start_ts_ms"),
        trace_end_ts_ms=m.get("trace_end_ts_ms"),
        duration_ms=_safe_int(m.get("duration_ms", 0)),
        event_count=_safe_int(m.get("event_count", 0)),
    )

    # 2. All spans — optimised direct attribute filter (no edge traversal)
    spans_q = f"""
MATCH (s:Span)
WHERE s.trace_id  = '{trace_id}'
  AND s.tenant_id = '{tid}'
RETURN elementId(s)        AS span_id,
       s.parent_span_id    AS parent_span_id,
       s.actor_type        AS actor_type,
       s.actor_label       AS actor_label,
       s.span_start_ts_ms  AS span_start_ts_ms,
       s.span_end_ts_ms    AS span_end_ts_ms,
       s.duration_ms       AS duration_ms,
       s.input_tokens      AS input_tokens,
       s.output_tokens     AS output_tokens,
       s.total_tokens      AS total_tokens,
       s.cost_usd          AS cost_usd,
       s.has_error         AS has_error
ORDER BY s.span_start_ts_ms
"""
    span_rows = await run_cypher(spans_q, settings)
    spans = [
        SpanDetail(
            span_id=str(r.get("span_id", "")),
            parent_span_id=r.get("parent_span_id") or None,
            actor_type=str(r.get("actor_type") or "session"),
            actor_label=str(r.get("actor_label") or ""),
            span_start_ts_ms=r.get("span_start_ts_ms"),
            span_end_ts_ms=r.get("span_end_ts_ms"),
            duration_ms=_safe_int(r.get("duration_ms", 0)),
            input_tokens=_safe_int(r.get("input_tokens", 0)),
            output_tokens=_safe_int(r.get("output_tokens", 0)),
            total_tokens=_safe_int(r.get("total_tokens", 0)),
            cost_usd=_safe_float(r.get("cost_usd", 0.0)),
            has_error=_safe_int(r.get("has_error", 0)),
        )
        for r in span_rows
    ]

    return TraceDetailResponse(meta=meta, spans=spans)
