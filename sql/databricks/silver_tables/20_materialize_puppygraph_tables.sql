-- ClawTrace PuppyGraph physical table materialization (DLT/Lakeflow SQL compatible).
-- Run as a SEPARATE Lakeflow pipeline from 10_materialize_silver_tables.sql.
-- Recommended frequency: lower than the events_all pipeline (e.g. every 15-30 min)
-- since these are full-scan aggregations over events_all.
--
-- One-time bootstrap (run outside Lakeflow pipeline in SQL Editor):
--   DROP MATERIALIZED VIEW IF EXISTS clawtrace.silver.pg_traces;
--   DROP MATERIALIZED VIEW IF EXISTS clawtrace.silver.pg_spans;
--   DROP MATERIALIZED VIEW IF EXISTS clawtrace.silver.pg_child_of_edges;
--
-- Dependency: clawtrace.silver.events_all must exist (produced by pipeline 10).

-- ─────────────────────────────────────────────────────────────────────────────
-- WHY PHYSICAL TABLES (not views)
--
-- PuppyGraph requires physical Delta tables for Iceberg/Delta Lake sources.
-- Confirmed constraints from PuppyGraph documentation:
--   - Views are NOT supported for Delta Lake / Iceberg catalogs
--   - No inline SQL expressions as vertex/edge IDs (existing columns only)
--   - No inline WHERE filter on edges (must be pre-filtered physical table)
--   - oneToOne vertex: source table must have exactly one row per vertex ID
--   - manyToOne vertex: deduplicates by ID but cannot carry attributes
--
-- TODO: Once PuppyGraph adds view support for Delta Lake sources (expected
-- ~May 2026 per PuppyGraph CEO), replace these three physical tables with
-- Databricks SQL Views defined directly over events_all. That eliminates this
-- pipeline entirely and removes the aggregation lag. The PuppyGraph schema
-- JSON (fromId/toId/attributes) stays identical — only the tableSource
-- objects change to point at views instead of materialized tables.
-- ─────────────────────────────────────────────────────────────────────────────
-- GRAPH MODEL SERVED BY THIS PIPELINE
--
-- Vertex: Agent    → manyToOne from events_all (no physical table needed)
-- Vertex: Trace    → pg_traces   (one row per trace)
-- Vertex: Span     → pg_spans    (one row per span)
-- Edge:   OWNS     → events_all  (no physical table needed)
-- Edge:   HAS_SPAN → events_all  (no physical table needed)
-- Edge:   CHILD_OF → pg_child_of_edges (pre-filtered: parent_span_id IS NOT NULL)
-- ─────────────────────────────────────────────────────────────────────────────

-- One row per trace with aggregated metrics.
CREATE OR REFRESH MATERIALIZED VIEW clawtrace.silver.pg_traces
AS
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
GROUP BY tenant_id, agent_id, trace_id;

-- ─────────────────────────────────────────────────────────────────────────────

-- One row per span with aggregated metrics from paired before/after events.
CREATE OR REFRESH MATERIALIZED VIEW clawtrace.silver.pg_spans
AS
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
  CASE
    WHEN MAX(model_name) IS NOT NULL THEN 'model'
    WHEN MAX(tool_name)  IS NOT NULL THEN 'tool'
    ELSE 'session'
  END                                   AS actor_type,
  -- LLM token usage (from llm_after_call payload)
  MAX(CAST(get_json_object(payload_json, '$.usage.input')  AS BIGINT)) AS input_tokens,
  MAX(CAST(get_json_object(payload_json, '$.usage.output') AS BIGINT)) AS output_tokens,
  MAX(CAST(get_json_object(payload_json, '$.usage.total')  AS BIGINT)) AS total_tokens,
  -- LLM cost (from llm_after_call payload)
  MAX(CAST(get_json_object(payload_json, '$.lastAssistant.usage.cost.total') AS DOUBLE)) AS cost_usd,
  -- Error flag
  MAX(CASE WHEN event_type = 'error' THEN 1 ELSE 0 END)               AS has_error
FROM clawtrace.silver.events_all
GROUP BY tenant_id, agent_id, trace_id, span_id, parent_span_id;

-- ─────────────────────────────────────────────────────────────────────────────

-- CHILD_OF edge source: spans that have a parent.
-- PuppyGraph has no inline WHERE filter — must be a physical pre-filtered table.
CREATE OR REFRESH MATERIALIZED VIEW clawtrace.silver.pg_child_of_edges
AS
SELECT
  tenant_id,
  agent_id,
  trace_id,
  span_id,
  parent_span_id
FROM clawtrace.silver.events_all
WHERE parent_span_id IS NOT NULL
GROUP BY tenant_id, agent_id, trace_id, span_id, parent_span_id;
