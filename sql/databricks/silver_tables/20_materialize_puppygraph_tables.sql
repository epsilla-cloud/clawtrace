-- ClawTrace PuppyGraph table refresh (incremental MERGE).
-- Run as a Databricks SQL Job on a lower-frequency schedule (every 15-30 min).
-- NOT a DLT pipeline — produces regular Delta tables readable by PuppyGraph.
--
-- Strategy: find traces/spans that received new events since the last pg_tables
-- checkpoint, then MERGE full re-aggregations for those entities only.
-- This is correct for aggregations: we must recompute from all events for an
-- affected trace/span, not just the new ones (e.g. event_count must be exact).
--
-- TODO: Once PuppyGraph adds view support for Delta Lake sources (~May 2026),
-- replace this entire job with Databricks SQL Views (see
-- 20_materialize_puppygraph_views.sql.disabled). The PuppyGraph schema JSON
-- stays identical — only the underlying tables become views.

-- ─────────────────────────────────────────────────────────────────────────────
-- OPTIMIZATION RATIONALE (tables defined in 00_bootstrap)
--
-- pg_traces:
--   CLUSTER BY (tenant_id, agent_id, trace_id) — vertex lookup by trace and
--   agent drilldown. Analytics sorted by duration_ms / trace_date also benefit.
--
-- pg_spans:
--   CLUSTER BY (trace_id, span_id) — primary PuppyGraph access is HAS_SPAN
--   traversal: fetch all spans within a trace. actor_type (4 values) excluded
--   from clustering — no benefit and breaks trace-level co-location.
--   actor_label excluded from dataSkippingStatsColumns: free-text model/tool
--   name (e.g. "gemini-3.1-pro-preview"), never used as a range filter.
--   cost_usd: OpenClaw does NOT report cost in USD — only raw token counts
--   (usage: { input, output, cacheRead, cacheWrite, total }).
--   We estimate cost from model name + token counts using published pricing.
--   For production accuracy, maintain a pricing table in the backend.
--
-- pg_child_of_edges:
--   CLUSTER BY (trace_id, parent_span_id) — most frequent traversal is
--   "find all children of span X in trace Y" (filters on parent_span_id).
--   Pre-filtered to parent_span_id IS NOT NULL: PuppyGraph has no inline
--   WHERE filter support on edge tableSource — physical pre-filtering required.
-- ─────────────────────────────────────────────────────────────────────────────

-- pg_tenants: one row per tenant (Tenant vertex + root of HAS_AGENT edge)
MERGE INTO clawtrace.silver.pg_tenants AS t
USING (
  SELECT DISTINCT tenant_id
  FROM clawtrace.silver.events_all
  WHERE ingest_ts > (
    SELECT last_run_ts FROM clawtrace.silver._checkpoint WHERE pipeline = 'pg_tables'
  )
) AS s
ON t.tenant_id = s.tenant_id
WHEN NOT MATCHED THEN INSERT *;

-- ─────────────────────────────────────────────────────────────────────────────

-- pg_agents: one row per agent (Agent vertex + source for HAS_AGENT and OWNS edges)
MERGE INTO clawtrace.silver.pg_agents AS t
USING (
  SELECT DISTINCT tenant_id, agent_id
  FROM clawtrace.silver.events_all
  WHERE ingest_ts > (
    SELECT last_run_ts FROM clawtrace.silver._checkpoint WHERE pipeline = 'pg_tables'
  )
) AS s
ON t.tenant_id = s.tenant_id AND t.agent_id = s.agent_id
WHEN NOT MATCHED THEN INSERT *;

-- ─────────────────────────────────────────────────────────────────────────────

-- pg_traces: one row per trace, carries duration + event_count
MERGE INTO clawtrace.silver.pg_traces AS t
USING (
  SELECT
    tenant_id,
    agent_id,
    trace_id,
    MIN(event_ts_ms)                      AS trace_start_ts_ms,
    MAX(event_ts_ms)                      AS trace_end_ts_ms,
    MAX(event_ts_ms) - MIN(event_ts_ms)   AS duration_ms,
    COUNT(*)                              AS event_count,
    MIN(event_date)                       AS trace_date
  FROM clawtrace.silver.events_all
  WHERE trace_id IN (
    -- Only recompute traces that got new events since the last pg refresh
    SELECT DISTINCT trace_id
    FROM   clawtrace.silver.events_all
    WHERE  ingest_ts > (
      SELECT last_run_ts FROM clawtrace.silver._checkpoint WHERE pipeline = 'pg_tables'
    )
  )
  GROUP BY tenant_id, agent_id, trace_id
) AS s
ON  t.tenant_id = s.tenant_id
AND t.trace_id  = s.trace_id
WHEN MATCHED THEN UPDATE SET
  trace_start_ts_ms = s.trace_start_ts_ms,
  trace_end_ts_ms   = s.trace_end_ts_ms,
  duration_ms       = s.duration_ms,
  event_count       = s.event_count,
  trace_date        = s.trace_date
WHEN NOT MATCHED THEN INSERT *;

-- ─────────────────────────────────────────────────────────────────────────────

-- pg_spans: one row per span, carries tokens + cost + duration
MERGE INTO clawtrace.silver.pg_spans AS t
USING (
  SELECT
    tenant_id,
    agent_id,
    trace_id,
    span_id,
    parent_span_id,
    MIN(event_ts_ms)                      AS span_start_ts_ms,
    MAX(event_ts_ms)                      AS span_end_ts_ms,
    MAX(event_ts_ms) - MIN(event_ts_ms)   AS duration_ms,
    COALESCE(MAX(model_name), MAX(tool_name), MAX(span_name), 'session') AS actor_label,
    -- actor_type maps to TraceDetailSpanKind on the frontend:
    --   llm_call  = LLM step (model_name present)
    --   tool_call = tool action (tool_name present, no model_name)
    --   subagent  = spawned child session (parent_span_id IS NOT NULL, no model/tool)
    --   session   = root orchestrator session
    CASE
      WHEN MAX(model_name)  IS NOT NULL THEN 'llm_call'
      WHEN MAX(tool_name)   IS NOT NULL THEN 'tool_call'
      WHEN parent_span_id   IS NOT NULL THEN 'subagent'
      ELSE 'session'
    END                                   AS actor_type,
    MAX(CAST(get_json_object(payload_json, '$.usage.input')  AS BIGINT)) AS input_tokens,
    MAX(CAST(get_json_object(payload_json, '$.usage.output') AS BIGINT)) AS output_tokens,
    MAX(CAST(get_json_object(payload_json, '$.usage.total')  AS BIGINT)) AS total_tokens,
    -- OpenClaw hooks report raw token counts only — NOT USD cost.
    -- Estimate cost from model name + token counts. For production accuracy,
    -- maintain a pricing table in the backend and override this value.
    CASE
      WHEN MAX(model_name) LIKE '%claude%opus%'   THEN
        (COALESCE(MAX(CAST(get_json_object(payload_json, '$.usage.input')  AS BIGINT)), 0) * 15.0
       + COALESCE(MAX(CAST(get_json_object(payload_json, '$.usage.output') AS BIGINT)), 0) * 75.0) / 1000000
      WHEN MAX(model_name) LIKE '%claude%sonnet%' THEN
        (COALESCE(MAX(CAST(get_json_object(payload_json, '$.usage.input')  AS BIGINT)), 0) * 3.0
       + COALESCE(MAX(CAST(get_json_object(payload_json, '$.usage.output') AS BIGINT)), 0) * 15.0) / 1000000
      WHEN MAX(model_name) LIKE '%claude%haiku%'  THEN
        (COALESCE(MAX(CAST(get_json_object(payload_json, '$.usage.input')  AS BIGINT)), 0) * 0.25
       + COALESCE(MAX(CAST(get_json_object(payload_json, '$.usage.output') AS BIGINT)), 0) * 1.25) / 1000000
      WHEN MAX(model_name) LIKE '%gpt-4o%'        THEN
        (COALESCE(MAX(CAST(get_json_object(payload_json, '$.usage.input')  AS BIGINT)), 0) * 2.5
       + COALESCE(MAX(CAST(get_json_object(payload_json, '$.usage.output') AS BIGINT)), 0) * 10.0) / 1000000
      WHEN MAX(model_name) LIKE '%gemini%pro%'    THEN
        (COALESCE(MAX(CAST(get_json_object(payload_json, '$.usage.input')  AS BIGINT)), 0) * 1.25
       + COALESCE(MAX(CAST(get_json_object(payload_json, '$.usage.output') AS BIGINT)), 0) * 5.0) / 1000000
      WHEN MAX(model_name) LIKE '%gemini%flash%'  THEN
        (COALESCE(MAX(CAST(get_json_object(payload_json, '$.usage.input')  AS BIGINT)), 0) * 0.075
       + COALESCE(MAX(CAST(get_json_object(payload_json, '$.usage.output') AS BIGINT)), 0) * 0.30) / 1000000
      WHEN MAX(model_name) IS NOT NULL             THEN
        -- Fallback: $4/1M input, $12/1M output (mid-tier estimate)
        (COALESCE(MAX(CAST(get_json_object(payload_json, '$.usage.input')  AS BIGINT)), 0) * 4.0
       + COALESCE(MAX(CAST(get_json_object(payload_json, '$.usage.output') AS BIGINT)), 0) * 12.0) / 1000000
      ELSE NULL
    END                                           AS cost_usd,
    MAX(CASE WHEN event_type = 'error' THEN 1 ELSE 0 END)               AS has_error
  FROM clawtrace.silver.events_all
  WHERE trace_id IN (
    SELECT DISTINCT trace_id
    FROM   clawtrace.silver.events_all
    WHERE  ingest_ts > (
      SELECT last_run_ts FROM clawtrace.silver._checkpoint WHERE pipeline = 'pg_tables'
    )
  )
  GROUP BY tenant_id, agent_id, trace_id, span_id, parent_span_id
) AS s
ON  t.trace_id = s.trace_id
AND t.span_id  = s.span_id
WHEN MATCHED THEN UPDATE SET
  span_start_ts_ms = s.span_start_ts_ms,
  span_end_ts_ms   = s.span_end_ts_ms,
  duration_ms      = s.duration_ms,
  actor_label      = s.actor_label,
  actor_type       = s.actor_type,
  input_tokens     = s.input_tokens,
  output_tokens    = s.output_tokens,
  total_tokens     = s.total_tokens,
  cost_usd         = s.cost_usd,
  has_error        = s.has_error
WHEN NOT MATCHED THEN INSERT *;

-- ─────────────────────────────────────────────────────────────────────────────

-- pg_child_of_edges: spans with a parent (pure insert, edges never change)
MERGE INTO clawtrace.silver.pg_child_of_edges AS t
USING (
  SELECT DISTINCT tenant_id, agent_id, trace_id, span_id, parent_span_id
  FROM clawtrace.silver.events_all
  WHERE parent_span_id IS NOT NULL
    AND ingest_ts > (
      SELECT last_run_ts FROM clawtrace.silver._checkpoint WHERE pipeline = 'pg_tables'
    )
) AS s
ON  t.trace_id = s.trace_id
AND t.span_id  = s.span_id
WHEN NOT MATCHED THEN INSERT *;

-- ─────────────────────────────────────────────────────────────────────────────

-- Advance checkpoint
UPDATE clawtrace.silver._checkpoint
SET    last_run_ts = current_timestamp()
WHERE  pipeline = 'pg_tables';
