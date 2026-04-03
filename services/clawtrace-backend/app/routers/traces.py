"""
Traces API — backed by PuppyGraph Cypher queries.

All endpoints verify that the requested agent belongs to the authenticated
tenant by including tenant_id in the Cypher WHERE clause.

elementId format in PuppyGraph: "Label[uuid-value]"
  e.g.  Tenant["77776f13-..."]  Agent["66661d11-..."]
"""
from __future__ import annotations

import time
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from ..auth import get_current_user, get_settings
from ..config import Settings
from ..models import UserSession
from ..puppygraph import run_cypher

router = APIRouter(prefix="/v1/traces", tags=["traces"])

MS_PER_DAY = 86_400_000


def _default_range() -> tuple[int, int]:
    """Default: last 7 days."""
    now = int(time.time() * 1000)
    return now - 7 * MS_PER_DAY, now


def _tenant_id(session: UserSession) -> str:
    return session.db_id


# ── Response models ───────────────────────────────────────────────────────────

class TraceMetrics(BaseModel):
    total_traces: int
    total_tokens: int
    total_cost_usd: float
    success_rate: float          # 0-1


class TrendPoint(BaseModel):
    date: str                    # YYYY-MM-DD
    run_count: int
    cost_usd: float


class TraceRow(BaseModel):
    trace_id: str                # elementId format: "Trace[uuid]"
    started_at_ms: Optional[int]
    duration_ms: Optional[int]
    event_count: Optional[int]
    input_tokens: Optional[int]
    output_tokens: Optional[int]
    total_tokens: Optional[int]
    cost_usd: Optional[float]
    has_error: int


class TracesResponse(BaseModel):
    metrics: TraceMetrics
    trends: list[TrendPoint]
    traces: list[TraceRow]


# ── Helpers ───────────────────────────────────────────────────────────────────

def _agent_eid(agent_id: str) -> str:
    return f"Agent[{agent_id}]"


def _tenant_eid(tenant_id: str) -> str:
    return f"Tenant[{tenant_id}]"


async def _verify_agent_ownership(
    agent_id: str, tenant_id: str, settings: Settings
) -> None:
    """Raise 403 if agent doesn't belong to this tenant."""
    q = f"""
    MATCH (ten:Tenant)-[:HAS_AGENT]->(a:Agent)
    WHERE elementId(ten) = '{_tenant_eid(tenant_id)}'
      AND elementId(a)   = '{_agent_eid(agent_id)}'
    RETURN count(a) AS cnt
    """
    rows = await run_cypher(q, settings)
    if not rows or int(rows[0].get("cnt", 0)) == 0:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="agent not found for this tenant")


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("", response_model=TracesResponse)
async def get_traces(
    agent_id: str = Query(..., description="Agent UUID"),
    from_ms: Optional[int] = Query(None, description="Start timestamp ms (default: 7 days ago)"),
    to_ms: Optional[int] = Query(None, description="End timestamp ms (default: now)"),
    limit: int = Query(100, ge=1, le=500),
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
) -> TracesResponse:
    """
    Return summary metrics, time-series trends, and trace list for an agent.
    Scoped to the authenticated tenant — unauthorised agents return 403.
    """
    tid = _tenant_id(session)
    await _verify_agent_ownership(agent_id, tid, settings)

    if from_ms is None or to_ms is None:
        _from, _to = _default_range()
        from_ms = from_ms or _from
        to_ms   = to_ms   or _to

    a_eid  = _agent_eid(agent_id)
    t_eid  = _tenant_eid(tid)

    # ── 1. Aggregate metrics ──────────────────────────────────────────────────
    metrics_q = f"""
    MATCH (ten:Tenant)-[:HAS_AGENT]->(a:Agent)-[:OWNS]->(t:Trace)
    WHERE elementId(ten) = '{t_eid}'
      AND elementId(a)   = '{a_eid}'
      AND t.trace_start_ts_ms >= {from_ms}
      AND t.trace_start_ts_ms <= {to_ms}
    OPTIONAL MATCH (t)-[:HAS_SPAN]->(s:Span)
    RETURN
      count(DISTINCT t)                               AS total_traces,
      coalesce(sum(s.total_tokens),  0)               AS total_tokens,
      coalesce(sum(s.cost_usd),      0.0)             AS total_cost,
      count(DISTINCT CASE WHEN s.has_error = 1 THEN t.trace_id END) AS error_traces
    """
    m_rows = await run_cypher(metrics_q, settings)
    m = m_rows[0] if m_rows else {}
    total_traces = int(m.get("total_traces", 0))
    error_traces = int(m.get("error_traces", 0))
    success_rate = round(1 - error_traces / total_traces, 4) if total_traces else 1.0

    metrics = TraceMetrics(
        total_traces=total_traces,
        total_tokens=int(m.get("total_tokens", 0) or 0),
        total_cost_usd=float(m.get("total_cost", 0.0) or 0.0),
        success_rate=success_rate,
    )

    # ── 2. Time-series trends (per day) ───────────────────────────────────────
    trends_q = f"""
    MATCH (ten:Tenant)-[:HAS_AGENT]->(a:Agent)-[:OWNS]->(t:Trace)
    WHERE elementId(ten) = '{t_eid}'
      AND elementId(a)   = '{a_eid}'
      AND t.trace_start_ts_ms >= {from_ms}
      AND t.trace_start_ts_ms <= {to_ms}
    OPTIONAL MATCH (t)-[:HAS_SPAN]->(s:Span)
    RETURN
      t.trace_date                     AS date,
      count(DISTINCT t)               AS run_count,
      coalesce(sum(s.cost_usd), 0.0)  AS cost_usd
    ORDER BY date
    """
    t_rows = await run_cypher(trends_q, settings)
    trends = [
        TrendPoint(
            date=str(r.get("date", "")),
            run_count=int(r.get("run_count", 0) or 0),
            cost_usd=float(r.get("cost_usd", 0.0) or 0.0),
        )
        for r in t_rows
        if r.get("date")
    ]

    # ── 3. Trace list ─────────────────────────────────────────────────────────
    traces_q = f"""
    MATCH (ten:Tenant)-[:HAS_AGENT]->(a:Agent)-[:OWNS]->(t:Trace)
    WHERE elementId(ten) = '{t_eid}'
      AND elementId(a)   = '{a_eid}'
      AND t.trace_start_ts_ms >= {from_ms}
      AND t.trace_start_ts_ms <= {to_ms}
    OPTIONAL MATCH (t)-[:HAS_SPAN]->(s:Span)
    RETURN
      elementId(t)                             AS trace_id,
      t.trace_start_ts_ms                      AS started_at_ms,
      t.duration_ms                            AS duration_ms,
      t.event_count                            AS event_count,
      coalesce(sum(s.input_tokens),  0)        AS input_tokens,
      coalesce(sum(s.output_tokens), 0)        AS output_tokens,
      coalesce(sum(s.total_tokens),  0)        AS total_tokens,
      coalesce(sum(s.cost_usd),      0.0)      AS cost_usd,
      max(coalesce(s.has_error, 0))            AS has_error
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
            input_tokens=int(r.get("input_tokens", 0) or 0),
            output_tokens=int(r.get("output_tokens", 0) or 0),
            total_tokens=int(r.get("total_tokens", 0) or 0),
            cost_usd=float(r.get("cost_usd", 0.0) or 0.0),
            has_error=int(r.get("has_error", 0) or 0),
        )
        for r in tr_rows
    ]

    return TracesResponse(metrics=metrics, trends=trends, traces=traces)
