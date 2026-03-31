-- ClawTrace silver materialization for PuppyGraph compatibility.
-- Replaces silver views with physical Delta tables (same names + same columns).

CREATE SCHEMA IF NOT EXISTS clawtrace.silver;

-- If legacy objects are views, drop them so table creation is deterministic.
DROP VIEW IF EXISTS clawtrace.silver.events_all;
DROP VIEW IF EXISTS clawtrace.silver.span_rollup;
DROP VIEW IF EXISTS clawtrace.silver.pg_spans;
DROP VIEW IF EXISTS clawtrace.silver.pg_agents;
DROP VIEW IF EXISTS clawtrace.silver.pg_traces;
DROP VIEW IF EXISTS clawtrace.silver.pg_trace_span_edges;
DROP VIEW IF EXISTS clawtrace.silver.pg_agent_span_edges;
DROP VIEW IF EXISTS clawtrace.silver.pg_span_parent_edges;

-- 1) events_all
CREATE OR REPLACE TABLE clawtrace.silver.events_all AS
WITH src AS (
  SELECT
    ingest_ts,
    agent_id,
    event_id,
    event_type,
    trace_id,
    span_id,
    parent_span_id,
    CAST(event_ts_ms AS BIGINT) AS event_ts_ms,
    raw_path,
    payload_json,
    -- unwrap if payload_json was double-encoded as "\"{...}\""
    regexp_replace(
      regexp_replace(trim(payload_json), '^"(\\{.*\\})"$', '$1'),
      '\\\\\"',
      '"'
    ) AS payload_norm
  FROM clawtrace.bronze.raw_events_ingest
)
SELECT
  ingest_ts,
  regexp_extract(raw_path, 'tenant=([^/]+)', 1) AS tenant_id,
  agent_id,
  event_id,
  event_type,
  trace_id,
  span_id,
  parent_span_id,
  event_ts_ms,

  -- span name candidates
  COALESCE(
    NULLIF(get_json_object(payload_norm, '$.name'), ''),
    NULLIF(get_json_object(payload_norm, '$.spanName'), ''),
    NULLIF(get_json_object(payload_norm, '$.span_name'), '')
  ) AS span_name,

  -- tool name candidates (includes fallback to model for tool hooks)
  COALESCE(
    NULLIF(get_json_object(payload_norm, '$.toolName'), ''),
    NULLIF(get_json_object(payload_norm, '$.tool_name'), ''),
    NULLIF(get_json_object(payload_norm, '$.tool'), ''),
    NULLIF(get_json_object(payload_norm, '$.toolCall.name'), ''),
    NULLIF(get_json_object(payload_norm, '$.tool_call.name'), ''),
    CASE WHEN event_type LIKE 'tool_%'
      THEN NULLIF(get_json_object(payload_norm, '$.model'), '')
      ELSE NULL
    END
  ) AS tool_name,

  COALESCE(
    NULLIF(get_json_object(payload_norm, '$.model'), ''),
    NULLIF(get_json_object(payload_norm, '$.modelName'), ''),
    NULLIF(get_json_object(payload_norm, '$.model_name'), '')
  ) AS model_name,

  payload_norm AS payload_json,
  raw_path
FROM src;

-- 2) span_rollup
CREATE OR REPLACE TABLE clawtrace.silver.span_rollup AS
SELECT
  tenant_id,
  agent_id,
  trace_id,
  span_id,
  parent_span_id,
  concat(trace_id, ':', span_id) AS span_uid,
  CASE WHEN parent_span_id IS NULL THEN NULL ELSE concat(trace_id, ':', parent_span_id) END AS parent_span_uid,
  MIN(event_ts_ms) AS span_start_ts_ms,
  MAX(event_ts_ms) AS span_end_ts_ms,
  MAX(event_ts_ms) - MIN(event_ts_ms) AS duration_ms,
  COALESCE(MAX(model_name), MAX(tool_name), MAX(span_name), 'span') AS actor_label,
  CASE
    WHEN MAX(model_name) IS NOT NULL THEN 'model'
    WHEN MAX(tool_name)  IS NOT NULL THEN 'tool'
    ELSE 'session'
  END AS actor_type
FROM clawtrace.silver.events_all
GROUP BY tenant_id, agent_id, trace_id, span_id, parent_span_id;

-- 3) pg_spans
CREATE OR REPLACE TABLE clawtrace.silver.pg_spans AS
SELECT
  tenant_id,
  agent_id,
  trace_id,
  span_id,
  parent_span_id,
  span_uid,
  parent_span_uid,
  concat(tenant_id, ':', trace_id) AS trace_vertex_id,
  concat(tenant_id, ':', agent_id) AS agent_vertex_id,
  span_start_ts_ms,
  span_end_ts_ms,
  duration_ms,
  actor_label,
  actor_type
FROM clawtrace.silver.span_rollup;

-- 4) pg_agents
CREATE OR REPLACE TABLE clawtrace.silver.pg_agents AS
SELECT
  tenant_id,
  agent_id,
  concat(tenant_id, ':', agent_id) AS agent_vertex_id
FROM clawtrace.silver.events_all
GROUP BY tenant_id, agent_id;

-- 5) pg_traces
CREATE OR REPLACE TABLE clawtrace.silver.pg_traces AS
SELECT
  tenant_id,
  agent_id,
  trace_id,
  concat(tenant_id, ':', trace_id) AS trace_vertex_id,
  MIN(event_ts_ms) AS trace_start_ts_ms,
  MAX(event_ts_ms) AS trace_end_ts_ms,
  MAX(event_ts_ms) - MIN(event_ts_ms) AS duration_ms,
  COUNT(DISTINCT span_id) AS span_count,
  COUNT(*) AS event_count
FROM clawtrace.silver.events_all
GROUP BY tenant_id, agent_id, trace_id;

-- 6) pg_trace_span_edges
CREATE OR REPLACE TABLE clawtrace.silver.pg_trace_span_edges AS
SELECT
  tenant_id,
  agent_id,
  trace_vertex_id,
  span_uid AS span_vertex_id
FROM clawtrace.silver.pg_spans;

-- 7) pg_agent_span_edges
CREATE OR REPLACE TABLE clawtrace.silver.pg_agent_span_edges AS
SELECT
  tenant_id,
  agent_id,
  agent_vertex_id,
  span_uid AS span_vertex_id
FROM clawtrace.silver.pg_spans;

-- 8) pg_span_parent_edges
CREATE OR REPLACE TABLE clawtrace.silver.pg_span_parent_edges AS
SELECT
  tenant_id,
  agent_id,
  parent_span_uid AS parent_span_vertex_id,
  span_uid AS child_span_vertex_id
FROM clawtrace.silver.pg_spans
WHERE parent_span_uid IS NOT NULL;
