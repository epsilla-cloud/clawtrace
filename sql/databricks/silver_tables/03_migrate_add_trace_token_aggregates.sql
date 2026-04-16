-- One-time migration: add token aggregate columns to pg_traces.
--
-- WHY:
--   The traces list and metrics queries used OPTIONAL MATCH (t)-[:HAS_SPAN]->(s:Span)
--   to aggregate token counts at query time in PuppyGraph. For an agent with 500+
--   traces × 10+ spans each, this traverses 5,000+ edges and loads all span token
--   columns on every page load — a major memory pressure risk.
--
--   Pre-computing these aggregates in the Databricks ETL pipeline means PuppyGraph
--   returns a flat row per trace with no edge traversal needed for the list view.
--
-- WHAT THIS DOES:
--   1. ALTER TABLE: adds token aggregate columns to pg_traces.
--   2. UPDATE: backfills existing rows from events_all usage payloads.
--
-- RUN ONCE in Databricks SQL Editor after deploying job 20 changes.

ALTER TABLE clawtrace.silver.pg_traces ADD COLUMN total_input_tokens  BIGINT;
ALTER TABLE clawtrace.silver.pg_traces ADD COLUMN total_output_tokens BIGINT;
ALTER TABLE clawtrace.silver.pg_traces ADD COLUMN total_tokens        BIGINT;
ALTER TABLE clawtrace.silver.pg_traces ADD COLUMN has_error           INT;

-- Backfill existing rows from events_all using MERGE (Databricks UPDATE doesn't support FROM).
MERGE INTO clawtrace.silver.pg_traces AS t
USING (
  SELECT
    trace_id,
    tenant_id,
    COALESCE(SUM(CAST(get_json_object(payload_json, '$.usage.input')  AS BIGINT)), 0) AS total_input_tokens,
    COALESCE(SUM(CAST(get_json_object(payload_json, '$.usage.output') AS BIGINT)), 0) AS total_output_tokens,
    COALESCE(SUM(CAST(get_json_object(payload_json, '$.usage.total')  AS BIGINT)), 0) AS total_tokens,
    MAX(CASE WHEN event_type = 'error' THEN 1 ELSE 0 END)                             AS has_error
  FROM clawtrace.silver.events_all
  GROUP BY trace_id, tenant_id
) AS s
ON  t.trace_id  = s.trace_id
AND t.tenant_id = s.tenant_id
WHEN MATCHED THEN UPDATE SET
  total_input_tokens  = s.total_input_tokens,
  total_output_tokens = s.total_output_tokens,
  total_tokens        = s.total_tokens,
  has_error           = s.has_error;
