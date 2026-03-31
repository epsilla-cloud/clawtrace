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
-- QUERY PATTERNS & OPTIMIZATIONS
--
-- Primary access hierarchy (broadest → narrowest):
--   tenant_id  →  agent_id  →  trace_id  →  span_id / event_type
--
-- Liquid Clustering on (tenant_id, agent_id, trace_id):
--   Co-locates all events for a trace in the same data files. Covers every
--   query level: tenant list, agent drilldown, full trace fetch. Liquid
--   clustering is incrementally maintained — no manual OPTIMIZE needed and
--   no fixed partition skew with many small tenants.
--
-- Bloom filters on trace_id, span_id, event_id:
--   These are high-cardinality UUIDs used in point lookups ("fetch trace X",
--   "fetch span Y"). Bloom filters add a ~1 MB per-file index that eliminates
--   file reads with ~99% probability before any data is scanned.
--
-- Auto-optimize / auto-compact:
--   The pipeline runs every 3 minutes, each writing a small batch of files.
--   Without compaction, the table accumulates thousands of tiny files over
--   time which degrades scan performance. optimizeWrite coalesces writes;
--   autoCompact merges files in the background after each transaction.
--
-- Skipping payload_json in column statistics:
--   payload_json is a large, unstructured string never used as a filter.
--   Collecting min/max stats on it wastes checkpoint space and slows commits.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REFRESH STREAMING TABLE clawtrace.silver.events_all
CLUSTER BY (tenant_id, agent_id, trace_id)
TBLPROPERTIES (
  -- Bloom filters for UUID point lookups (default fpp ~1%)
  'delta.bloomFilter.trace_id.enabled' = 'true',
  'delta.bloomFilter.span_id.enabled'  = 'true',
  'delta.bloomFilter.event_id.enabled' = 'true',
  -- Small-file compaction: merge writes and compact after each 3-min batch
  'delta.autoOptimize.optimizeWrite' = 'true',
  'delta.autoOptimize.autoCompact'   = 'true',
  -- Skip min/max statistics on the large unfiltered payload column
  'delta.dataSkippingStatsColumns'   = 'tenant_id,agent_id,event_id,event_type,trace_id,span_id,parent_span_id,event_ts_ms,tool_name,model_name,event_date'
)
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
    -- Derived date for time-range pruning (complements clustering)
    DATE(TIMESTAMP_MILLIS(CAST(event.tsMs AS BIGINT))) AS event_date,
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
    -- Drop OpenClaw shadow duplicates: after_tool_call fires twice — once with
    -- session context (kept) and once from a global hook path with no session
    -- and no toolCallId (3-5ms later). The duplicate carries no span linkage
    -- and is identifiable by sessionKey="unknown" + absent toolCallId.
    AND NOT (
      event.eventType = 'tool_after_call'
      AND get_json_object(CAST(to_json(event.payload) AS STRING), '$.sessionKey') = 'unknown'
      AND get_json_object(CAST(to_json(event.payload) AS STRING), '$.toolCallId') IS NULL
    )
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
    event_date,
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
  event_date,
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
