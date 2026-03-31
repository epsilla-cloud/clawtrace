-- ClawTrace silver materialization for PuppyGraph compatibility.
-- Incremental mode:
--   - Read only new bronze rows after saved watermark.
--   - Upsert events_all by event_id.
--   - Recompute only impacted spans/traces/agents and related edge rows.
--
-- First run behavior:
--   - Watermark defaults to 1970-01-01, so the first run backfills all files.

CREATE SCHEMA IF NOT EXISTS clawtrace.silver;

-- If legacy objects are views, drop them so table DDL is deterministic.
DROP VIEW IF EXISTS clawtrace.silver.events_all;
DROP VIEW IF EXISTS clawtrace.silver.span_rollup;
DROP VIEW IF EXISTS clawtrace.silver.pg_spans;
DROP VIEW IF EXISTS clawtrace.silver.pg_agents;
DROP VIEW IF EXISTS clawtrace.silver.pg_traces;
DROP VIEW IF EXISTS clawtrace.silver.pg_trace_span_edges;
DROP VIEW IF EXISTS clawtrace.silver.pg_agent_span_edges;
DROP VIEW IF EXISTS clawtrace.silver.pg_span_parent_edges;

-- Stateful watermark used by this job.
CREATE TABLE IF NOT EXISTS clawtrace.silver.__materialization_state (
  pipeline_name  STRING,
  last_ingest_ts TIMESTAMP,
  updated_at     TIMESTAMP
) USING DELTA;

MERGE INTO clawtrace.silver.__materialization_state t
USING (
  SELECT
    'silver_tables_v1' AS pipeline_name,
    CAST('1970-01-01 00:00:00' AS TIMESTAMP) AS default_ingest_ts
) s
ON t.pipeline_name = s.pipeline_name
WHEN NOT MATCHED THEN
  INSERT (pipeline_name, last_ingest_ts, updated_at)
  VALUES (s.pipeline_name, s.default_ingest_ts, current_timestamp());

CREATE OR REPLACE TEMP VIEW _ct_watermark AS
SELECT
  COALESCE(MAX(last_ingest_ts), CAST('1970-01-01 00:00:00' AS TIMESTAMP)) AS last_ingest_ts
FROM clawtrace.silver.__materialization_state
WHERE pipeline_name = 'silver_tables_v1';

-- Read only new bronze rows since last successful run and normalize payload.
CREATE OR REPLACE TEMP VIEW _ct_events_delta_prepared AS
WITH src AS (
  SELECT
    b.ingest_ts,
    b.agent_id,
    b.event_id,
    b.event_type,
    b.trace_id,
    b.span_id,
    b.parent_span_id,
    CAST(b.event_ts_ms AS BIGINT) AS event_ts_ms,
    b.raw_path,
    b.payload_json,
    regexp_replace(
      regexp_replace(trim(b.payload_json), '^"(\\{.*\\})"$', '$1'),
      '\\\\\"',
      '"'
    ) AS payload_norm
  FROM clawtrace.bronze.raw_events_ingest b
  CROSS JOIN _ct_watermark wm
  WHERE b.ingest_ts > wm.last_ingest_ts
    AND b.event_id IS NOT NULL
    AND b.event_type IS NOT NULL
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
  COALESCE(
    NULLIF(get_json_object(payload_norm, '$.name'), ''),
    NULLIF(get_json_object(payload_norm, '$.spanName'), ''),
    NULLIF(get_json_object(payload_norm, '$.span_name'), '')
  ) AS span_name,
  COALESCE(
    NULLIF(get_json_object(payload_norm, '$.toolName'), ''),
    NULLIF(get_json_object(payload_norm, '$.tool_name'), ''),
    NULLIF(get_json_object(payload_norm, '$.tool'), ''),
    NULLIF(get_json_object(payload_norm, '$.toolCall.name'), ''),
    NULLIF(get_json_object(payload_norm, '$.tool_call.name'), ''),
    CASE
      WHEN event_type LIKE 'tool_%' THEN NULLIF(get_json_object(payload_norm, '$.model'), '')
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

-- Base silver table that receives incremental upserts.
CREATE TABLE IF NOT EXISTS clawtrace.silver.events_all (
  ingest_ts       TIMESTAMP,
  tenant_id       STRING,
  agent_id        STRING,
  event_id        STRING,
  event_type      STRING,
  trace_id        STRING,
  span_id         STRING,
  parent_span_id  STRING,
  event_ts_ms     BIGINT,
  span_name       STRING,
  tool_name       STRING,
  model_name      STRING,
  payload_json    STRING,
  raw_path        STRING
) USING DELTA;

MERGE INTO clawtrace.silver.events_all t
USING _ct_events_delta_prepared s
ON t.event_id = s.event_id
WHEN MATCHED AND s.ingest_ts > t.ingest_ts THEN UPDATE SET
  t.ingest_ts = s.ingest_ts,
  t.tenant_id = s.tenant_id,
  t.agent_id = s.agent_id,
  t.event_id = s.event_id,
  t.event_type = s.event_type,
  t.trace_id = s.trace_id,
  t.span_id = s.span_id,
  t.parent_span_id = s.parent_span_id,
  t.event_ts_ms = s.event_ts_ms,
  t.span_name = s.span_name,
  t.tool_name = s.tool_name,
  t.model_name = s.model_name,
  t.payload_json = s.payload_json,
  t.raw_path = s.raw_path
WHEN NOT MATCHED THEN INSERT (
  ingest_ts, tenant_id, agent_id, event_id, event_type, trace_id, span_id, parent_span_id,
  event_ts_ms, span_name, tool_name, model_name, payload_json, raw_path
)
VALUES (
  s.ingest_ts, s.tenant_id, s.agent_id, s.event_id, s.event_type, s.trace_id, s.span_id, s.parent_span_id,
  s.event_ts_ms, s.span_name, s.tool_name, s.model_name, s.payload_json, s.raw_path
);

-- Delta keysets that drive selective downstream refresh.
CREATE OR REPLACE TEMP VIEW _ct_impacted_spans AS
SELECT DISTINCT tenant_id, agent_id, trace_id, span_id
FROM _ct_events_delta_prepared
WHERE tenant_id IS NOT NULL
  AND trace_id IS NOT NULL
  AND span_id IS NOT NULL;

CREATE OR REPLACE TEMP VIEW _ct_impacted_traces AS
SELECT DISTINCT tenant_id, agent_id, trace_id
FROM _ct_events_delta_prepared
WHERE tenant_id IS NOT NULL
  AND trace_id IS NOT NULL;

CREATE OR REPLACE TEMP VIEW _ct_impacted_agents AS
SELECT DISTINCT tenant_id, agent_id
FROM _ct_events_delta_prepared
WHERE tenant_id IS NOT NULL
  AND agent_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS clawtrace.silver.span_rollup (
  tenant_id        STRING,
  agent_id         STRING,
  trace_id         STRING,
  span_id          STRING,
  parent_span_id   STRING,
  span_uid         STRING,
  parent_span_uid  STRING,
  span_start_ts_ms BIGINT,
  span_end_ts_ms   BIGINT,
  duration_ms      BIGINT,
  actor_label      STRING,
  actor_type       STRING
) USING DELTA;

-- Rebuild only impacted spans.
DELETE FROM clawtrace.silver.span_rollup t
WHERE EXISTS (
  SELECT 1
  FROM _ct_impacted_spans s
  WHERE t.tenant_id = s.tenant_id
    AND t.agent_id = s.agent_id
    AND t.trace_id = s.trace_id
    AND t.span_id = s.span_id
);

INSERT INTO clawtrace.silver.span_rollup
SELECT
  e.tenant_id,
  e.agent_id,
  e.trace_id,
  e.span_id,
  e.parent_span_id,
  concat(e.trace_id, ':', e.span_id) AS span_uid,
  CASE
    WHEN e.parent_span_id IS NULL THEN NULL
    ELSE concat(e.trace_id, ':', e.parent_span_id)
  END AS parent_span_uid,
  MIN(e.event_ts_ms) AS span_start_ts_ms,
  MAX(e.event_ts_ms) AS span_end_ts_ms,
  MAX(e.event_ts_ms) - MIN(e.event_ts_ms) AS duration_ms,
  COALESCE(MAX(e.model_name), MAX(e.tool_name), MAX(e.span_name), 'span') AS actor_label,
  CASE
    WHEN MAX(e.model_name) IS NOT NULL THEN 'model'
    WHEN MAX(e.tool_name) IS NOT NULL THEN 'tool'
    ELSE 'session'
  END AS actor_type
FROM clawtrace.silver.events_all e
INNER JOIN _ct_impacted_spans s
  ON e.tenant_id = s.tenant_id
 AND e.agent_id = s.agent_id
 AND e.trace_id = s.trace_id
 AND e.span_id = s.span_id
GROUP BY e.tenant_id, e.agent_id, e.trace_id, e.span_id, e.parent_span_id;

CREATE TABLE IF NOT EXISTS clawtrace.silver.pg_spans (
  tenant_id        STRING,
  agent_id         STRING,
  trace_id         STRING,
  span_id          STRING,
  parent_span_id   STRING,
  span_uid         STRING,
  parent_span_uid  STRING,
  trace_vertex_id  STRING,
  agent_vertex_id  STRING,
  span_start_ts_ms BIGINT,
  span_end_ts_ms   BIGINT,
  duration_ms      BIGINT,
  actor_label      STRING,
  actor_type       STRING
) USING DELTA;

DELETE FROM clawtrace.silver.pg_spans t
WHERE EXISTS (
  SELECT 1
  FROM _ct_impacted_spans s
  WHERE t.tenant_id = s.tenant_id
    AND t.agent_id = s.agent_id
    AND t.trace_id = s.trace_id
    AND t.span_id = s.span_id
);

INSERT INTO clawtrace.silver.pg_spans
SELECT
  r.tenant_id,
  r.agent_id,
  r.trace_id,
  r.span_id,
  r.parent_span_id,
  r.span_uid,
  r.parent_span_uid,
  concat(r.tenant_id, ':', r.trace_id) AS trace_vertex_id,
  concat(r.tenant_id, ':', r.agent_id) AS agent_vertex_id,
  r.span_start_ts_ms,
  r.span_end_ts_ms,
  r.duration_ms,
  r.actor_label,
  r.actor_type
FROM clawtrace.silver.span_rollup r
INNER JOIN _ct_impacted_spans s
  ON r.tenant_id = s.tenant_id
 AND r.agent_id = s.agent_id
 AND r.trace_id = s.trace_id
 AND r.span_id = s.span_id;

CREATE TABLE IF NOT EXISTS clawtrace.silver.pg_agents (
  tenant_id        STRING,
  agent_id         STRING,
  agent_vertex_id  STRING
) USING DELTA;

DELETE FROM clawtrace.silver.pg_agents t
WHERE EXISTS (
  SELECT 1
  FROM _ct_impacted_agents a
  WHERE t.tenant_id = a.tenant_id
    AND t.agent_id = a.agent_id
);

INSERT INTO clawtrace.silver.pg_agents
SELECT
  e.tenant_id,
  e.agent_id,
  concat(e.tenant_id, ':', e.agent_id) AS agent_vertex_id
FROM clawtrace.silver.events_all e
INNER JOIN _ct_impacted_agents a
  ON e.tenant_id = a.tenant_id
 AND e.agent_id = a.agent_id
GROUP BY e.tenant_id, e.agent_id;

CREATE TABLE IF NOT EXISTS clawtrace.silver.pg_traces (
  tenant_id         STRING,
  agent_id          STRING,
  trace_id          STRING,
  trace_vertex_id   STRING,
  trace_start_ts_ms BIGINT,
  trace_end_ts_ms   BIGINT,
  duration_ms       BIGINT,
  span_count        BIGINT,
  event_count       BIGINT
) USING DELTA;

DELETE FROM clawtrace.silver.pg_traces t
WHERE EXISTS (
  SELECT 1
  FROM _ct_impacted_traces tr
  WHERE t.tenant_id = tr.tenant_id
    AND t.agent_id = tr.agent_id
    AND t.trace_id = tr.trace_id
);

INSERT INTO clawtrace.silver.pg_traces
SELECT
  e.tenant_id,
  e.agent_id,
  e.trace_id,
  concat(e.tenant_id, ':', e.trace_id) AS trace_vertex_id,
  MIN(e.event_ts_ms) AS trace_start_ts_ms,
  MAX(e.event_ts_ms) AS trace_end_ts_ms,
  MAX(e.event_ts_ms) - MIN(e.event_ts_ms) AS duration_ms,
  COUNT(DISTINCT e.span_id) AS span_count,
  COUNT(*) AS event_count
FROM clawtrace.silver.events_all e
INNER JOIN _ct_impacted_traces tr
  ON e.tenant_id = tr.tenant_id
 AND e.agent_id = tr.agent_id
 AND e.trace_id = tr.trace_id
GROUP BY e.tenant_id, e.agent_id, e.trace_id;

CREATE TABLE IF NOT EXISTS clawtrace.silver.pg_trace_span_edges (
  tenant_id       STRING,
  agent_id        STRING,
  trace_vertex_id STRING,
  span_vertex_id  STRING
) USING DELTA;

DELETE FROM clawtrace.silver.pg_trace_span_edges t
WHERE EXISTS (
  SELECT 1
  FROM _ct_impacted_traces tr
  WHERE t.tenant_id = tr.tenant_id
    AND t.agent_id = tr.agent_id
    AND t.trace_vertex_id = concat(tr.tenant_id, ':', tr.trace_id)
);

INSERT INTO clawtrace.silver.pg_trace_span_edges
SELECT
  s.tenant_id,
  s.agent_id,
  s.trace_vertex_id,
  s.span_uid AS span_vertex_id
FROM clawtrace.silver.pg_spans s
INNER JOIN _ct_impacted_traces tr
  ON s.tenant_id = tr.tenant_id
 AND s.agent_id = tr.agent_id
 AND s.trace_id = tr.trace_id;

CREATE TABLE IF NOT EXISTS clawtrace.silver.pg_agent_span_edges (
  tenant_id        STRING,
  agent_id         STRING,
  agent_vertex_id  STRING,
  span_vertex_id   STRING
) USING DELTA;

DELETE FROM clawtrace.silver.pg_agent_span_edges t
WHERE EXISTS (
  SELECT 1
  FROM _ct_impacted_spans s
  WHERE t.tenant_id = s.tenant_id
    AND t.agent_id = s.agent_id
    AND t.span_vertex_id = concat(s.trace_id, ':', s.span_id)
);

INSERT INTO clawtrace.silver.pg_agent_span_edges
SELECT
  p.tenant_id,
  p.agent_id,
  p.agent_vertex_id,
  p.span_uid AS span_vertex_id
FROM clawtrace.silver.pg_spans p
INNER JOIN _ct_impacted_spans s
  ON p.tenant_id = s.tenant_id
 AND p.agent_id = s.agent_id
 AND p.trace_id = s.trace_id
 AND p.span_id = s.span_id;

CREATE TABLE IF NOT EXISTS clawtrace.silver.pg_span_parent_edges (
  tenant_id               STRING,
  agent_id                STRING,
  parent_span_vertex_id   STRING,
  child_span_vertex_id    STRING
) USING DELTA;

DELETE FROM clawtrace.silver.pg_span_parent_edges t
WHERE EXISTS (
  SELECT 1
  FROM _ct_impacted_spans s
  WHERE t.tenant_id = s.tenant_id
    AND t.agent_id = s.agent_id
    AND t.child_span_vertex_id = concat(s.trace_id, ':', s.span_id)
);

INSERT INTO clawtrace.silver.pg_span_parent_edges
SELECT
  p.tenant_id,
  p.agent_id,
  p.parent_span_uid AS parent_span_vertex_id,
  p.span_uid AS child_span_vertex_id
FROM clawtrace.silver.pg_spans p
INNER JOIN _ct_impacted_spans s
  ON p.tenant_id = s.tenant_id
 AND p.agent_id = s.agent_id
 AND p.trace_id = s.trace_id
 AND p.span_id = s.span_id
WHERE p.parent_span_uid IS NOT NULL;

-- Commit new watermark only after successful table refreshes.
MERGE INTO clawtrace.silver.__materialization_state t
USING (
  SELECT
    'silver_tables_v1' AS pipeline_name,
    COALESCE(
      (SELECT MAX(ingest_ts) FROM _ct_events_delta_prepared),
      (SELECT last_ingest_ts FROM _ct_watermark)
    ) AS new_last_ingest_ts
) s
ON t.pipeline_name = s.pipeline_name
WHEN MATCHED THEN UPDATE SET
  t.last_ingest_ts = CASE
    WHEN s.new_last_ingest_ts > t.last_ingest_ts THEN s.new_last_ingest_ts
    ELSE t.last_ingest_ts
  END,
  t.updated_at = current_timestamp();
