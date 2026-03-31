-- ClawTrace silver materialization (DLT/Lakeflow SQL compatible).
-- This file intentionally contains only DLT statements:
--   CREATE OR REFRESH STREAMING TABLE
--
-- One-time bootstrap (run outside Lakeflow pipeline in SQL Editor):
--   CREATE SCHEMA IF NOT EXISTS clawtrace.silver;
--   DROP TABLE IF EXISTS clawtrace.silver.events_all;
--   DROP TABLE IF EXISTS clawtrace.silver.__materialization_state;

-- ─────────────────────────────────────────────────────────────────────────────
-- ARCHITECTURE NOTE
--
-- events_all is the only table produced by this pipeline.
-- It is a pure append-only stream from raw ADLS files — cheap, incremental,
-- and serves as the single source of truth for PuppyGraph.
--
-- PuppyGraph derives graph topology (agents, traces, spans, edges) directly
-- from events_all at query time via its schema mapping. No pre-aggregated
-- graph tables are needed; PuppyGraph builds and caches them per-query.
--
-- Deferred tables (restore when a concrete UI consumer exists):
--
--   span_rollup     — per-span duration + actor_type aggregates
--                     Restore for: cost dashboard, latency P50/P99 charts
--
--   pg_spans        — span vertex projection over span_rollup
--   pg_agents       — agent vertex projection
--   pg_traces       — trace vertex projection with duration + event_count
--   pg_trace_span_edges   — trace→span edge table
--   pg_agent_span_edges   — agent→span edge table
--   pg_span_parent_edges  — parent→child span edge table
--
--                     Restore all pg_* tables for: fleet-level dashboards,
--                     cross-agent anomaly detection, enterprise multi-tenant
--                     analytics. At that point also consider switching to
--                     APPLY CHANGES INTO for incremental aggregation instead
--                     of full-scan MATERIALIZED VIEW (see cost analysis in
--                     git history).
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REFRESH STREAMING TABLE clawtrace.silver.events_all
AS
WITH raw_src AS (
  SELECT
    current_timestamp() AS ingest_ts,
    NULLIF(regexp_extract(_metadata.file_path, 'tenant=([^/]+)', 1), '') AS tenant_id,
    agentId AS agent_id,
    event.eventId AS event_id,
    event.eventType AS event_type,
    event.traceId AS trace_id,
    event.spanId AS span_id,
    event.parentSpanId AS parent_span_id,
    CAST(event.tsMs AS BIGINT) AS event_ts_ms,
    _metadata.file_path AS raw_path,
    CASE
      WHEN event.payload IS NULL THEN NULL
      ELSE CAST(to_json(event.payload) AS STRING)
    END AS payload_json
  FROM STREAM read_files(
    'abfss://clawtrace-raw@clawtracelake01.dfs.core.windows.net/raw/v1/',
    format => 'json'
  )
  WHERE event.eventId IS NOT NULL
    AND event.eventType IS NOT NULL
),
src AS (
  SELECT
    ingest_ts,
    tenant_id,
    agent_id,
    event_id,
    event_type,
    trace_id,
    span_id,
    parent_span_id,
    event_ts_ms,
    raw_path,
    payload_json
  FROM raw_src
)
SELECT
  ingest_ts,
  tenant_id,
  agent_id,
  event_id,
  event_type,
  trace_id,
  span_id,
  parent_span_id,
  event_ts_ms,
  COALESCE(
    NULLIF(get_json_object(payload_json, '$.name'), ''),
    NULLIF(get_json_object(payload_json, '$.spanName'), ''),
    NULLIF(get_json_object(payload_json, '$.span_name'), '')
  ) AS span_name,
  COALESCE(
    NULLIF(get_json_object(payload_json, '$.toolName'), ''),
    NULLIF(get_json_object(payload_json, '$.tool_name'), ''),
    NULLIF(get_json_object(payload_json, '$.tool'), ''),
    NULLIF(get_json_object(payload_json, '$.toolCall.name'), ''),
    NULLIF(get_json_object(payload_json, '$.tool_call.name'), ''),
    CASE
      WHEN event_type LIKE 'tool_%' THEN NULLIF(get_json_object(payload_json, '$.model'), '')
      ELSE NULL
    END
  ) AS tool_name,
  COALESCE(
    NULLIF(get_json_object(payload_json, '$.model'), ''),
    NULLIF(get_json_object(payload_json, '$.modelName'), ''),
    NULLIF(get_json_object(payload_json, '$.model_name'), '')
  ) AS model_name,
  payload_json,
  raw_path
FROM src;
