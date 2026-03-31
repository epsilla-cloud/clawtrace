-- ClawTrace silver materialization (DLT/Lakeflow SQL compatible).
-- This file intentionally contains only DLT statements:
--   CREATE OR REFRESH STREAMING TABLE
--
-- One-time bootstrap (run outside Lakeflow pipeline in SQL Editor):
--   CREATE SCHEMA IF NOT EXISTS clawtrace.silver;
--   DROP TABLE IF EXISTS clawtrace.silver.events_all;
--   DROP MATERIALIZED VIEW IF EXISTS clawtrace.silver.span_rollup;
--   DROP MATERIALIZED VIEW IF EXISTS clawtrace.silver.pg_spans;
--   DROP MATERIALIZED VIEW IF EXISTS clawtrace.silver.pg_agents;
--   DROP MATERIALIZED VIEW IF EXISTS clawtrace.silver.pg_traces;
--   DROP MATERIALIZED VIEW IF EXISTS clawtrace.silver.pg_trace_span_edges;
--   DROP MATERIALIZED VIEW IF EXISTS clawtrace.silver.pg_agent_span_edges;
--   DROP MATERIALIZED VIEW IF EXISTS clawtrace.silver.pg_span_parent_edges;
--   DROP TABLE IF EXISTS clawtrace.silver.__materialization_state;

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

-- span_rollup aggregates over the full event history (GROUP BY forces Complete
-- output mode, which rewrites the table). Using MATERIALIZED VIEW avoids the
-- DELTA_SOURCE_TABLE_IGNORE_CHANGES error in downstream streaming consumers.
CREATE OR REFRESH MATERIALIZED VIEW clawtrace.silver.span_rollup
AS
SELECT
  tenant_id,
  agent_id,
  trace_id,
  span_id,
  parent_span_id,
  concat(trace_id, ':', span_id) AS span_uid,
  CASE
    WHEN parent_span_id IS NULL THEN NULL
    ELSE concat(trace_id, ':', parent_span_id)
  END AS parent_span_uid,
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

CREATE OR REFRESH MATERIALIZED VIEW clawtrace.silver.pg_spans
AS
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

-- pg_agents and pg_traces use GROUP BY, so materialized views are correct here too.
CREATE OR REFRESH MATERIALIZED VIEW clawtrace.silver.pg_agents
AS
SELECT
  tenant_id,
  agent_id,
  concat(tenant_id, ':', agent_id) AS agent_vertex_id
FROM clawtrace.silver.events_all
GROUP BY tenant_id, agent_id;

CREATE OR REFRESH MATERIALIZED VIEW clawtrace.silver.pg_traces
AS
SELECT
  tenant_id,
  agent_id,
  trace_id,
  concat(tenant_id, ':', trace_id) AS trace_vertex_id,
  MIN(event_ts_ms) AS trace_start_ts_ms,
  MAX(event_ts_ms) AS trace_end_ts_ms,
  MAX(event_ts_ms) - MIN(event_ts_ms) AS duration_ms,
  COUNT(*) AS event_count
FROM clawtrace.silver.events_all
GROUP BY tenant_id, agent_id, trace_id;

CREATE OR REFRESH MATERIALIZED VIEW clawtrace.silver.pg_trace_span_edges
AS
SELECT
  tenant_id,
  agent_id,
  trace_vertex_id,
  span_uid AS span_vertex_id
FROM clawtrace.silver.pg_spans;

CREATE OR REFRESH MATERIALIZED VIEW clawtrace.silver.pg_agent_span_edges
AS
SELECT
  tenant_id,
  agent_id,
  agent_vertex_id,
  span_uid AS span_vertex_id
FROM clawtrace.silver.pg_spans;

CREATE OR REFRESH MATERIALIZED VIEW clawtrace.silver.pg_span_parent_edges
AS
SELECT
  tenant_id,
  agent_id,
  parent_span_uid AS parent_span_vertex_id,
  span_uid AS child_span_vertex_id
FROM clawtrace.silver.pg_spans
WHERE parent_span_uid IS NOT NULL;
