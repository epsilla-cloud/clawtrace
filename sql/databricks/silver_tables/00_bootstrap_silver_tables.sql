-- ClawTrace silver layer bootstrap.
-- Run ONCE in Databricks SQL Editor before starting any jobs.
-- Creates regular Delta tables (not DLT) so PuppyGraph can read them.

CREATE SCHEMA IF NOT EXISTS clawtrace.silver;

-- ── Checkpoint table ─────────────────────────────────────────────────────────
-- Tracks the last successful run for each pipeline so jobs only process
-- new files/rows. Seeded to epoch so the first run processes everything.

CREATE TABLE IF NOT EXISTS clawtrace.silver._checkpoint (
  pipeline    STRING  NOT NULL,
  last_run_ts TIMESTAMP NOT NULL
);

INSERT INTO clawtrace.silver._checkpoint
SELECT 'events',    TIMESTAMP '1970-01-01 00:00:00' WHERE NOT EXISTS (SELECT 1 FROM clawtrace.silver._checkpoint WHERE pipeline = 'events');
INSERT INTO clawtrace.silver._checkpoint
SELECT 'pg_tables', TIMESTAMP '1970-01-01 00:00:00' WHERE NOT EXISTS (SELECT 1 FROM clawtrace.silver._checkpoint WHERE pipeline = 'pg_tables');

-- ── events_all ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS clawtrace.silver.events_all (
  ingest_ts      TIMESTAMP,
  tenant_id      STRING,
  agent_id       STRING,
  event_id       STRING NOT NULL,
  event_type     STRING,
  trace_id       STRING,
  span_id        STRING,
  parent_span_id STRING,
  event_ts_ms    BIGINT,
  event_date     DATE,
  span_name      STRING,
  tool_name      STRING,
  model_name     STRING,
  payload_json   STRING,
  raw_path       STRING
)
CLUSTER BY (tenant_id, agent_id, trace_id)
TBLPROPERTIES (
  'delta.autoOptimize.optimizeWrite' = 'true',
  'delta.autoOptimize.autoCompact'   = 'true',
  'delta.dataSkippingStatsColumns'   = 'tenant_id,agent_id,event_id,event_type,trace_id,span_id,parent_span_id,event_ts_ms,tool_name,model_name,event_date'
);

-- ── pg_traces ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS clawtrace.silver.pg_traces (
  tenant_id        STRING NOT NULL,
  agent_id         STRING NOT NULL,
  trace_id         STRING NOT NULL,
  trace_start_ts_ms BIGINT,
  trace_end_ts_ms   BIGINT,
  duration_ms       BIGINT,
  event_count       BIGINT,
  trace_date        DATE
)
CLUSTER BY (tenant_id, agent_id, trace_id)
TBLPROPERTIES (
  'delta.autoOptimize.optimizeWrite' = 'true',
  'delta.autoOptimize.autoCompact'   = 'true',
  'delta.dataSkippingStatsColumns'   = 'tenant_id,agent_id,trace_id,trace_start_ts_ms,trace_end_ts_ms,duration_ms,trace_date'
);

-- ── pg_spans ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS clawtrace.silver.pg_spans (
  tenant_id      STRING NOT NULL,
  agent_id       STRING NOT NULL,
  trace_id       STRING NOT NULL,
  span_id        STRING NOT NULL,
  parent_span_id STRING,
  span_start_ts_ms BIGINT,
  span_end_ts_ms   BIGINT,
  duration_ms      BIGINT,
  actor_label    STRING,
  actor_type     STRING,
  input_tokens   BIGINT,
  output_tokens  BIGINT,
  total_tokens   BIGINT,
  cost_usd       DOUBLE,
  has_error      INT
)
CLUSTER BY (trace_id, span_id)
TBLPROPERTIES (
  'delta.autoOptimize.optimizeWrite' = 'true',
  'delta.autoOptimize.autoCompact'   = 'true',
  'delta.dataSkippingStatsColumns'   = 'tenant_id,agent_id,trace_id,span_id,parent_span_id,actor_type,span_start_ts_ms,duration_ms,cost_usd,has_error'
);

-- ── pg_child_of_edges ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS clawtrace.silver.pg_child_of_edges (
  tenant_id      STRING NOT NULL,
  agent_id       STRING NOT NULL,
  trace_id       STRING NOT NULL,
  span_id        STRING NOT NULL,
  parent_span_id STRING NOT NULL
)
CLUSTER BY (trace_id, parent_span_id)
TBLPROPERTIES (
  'delta.autoOptimize.optimizeWrite' = 'true',
  'delta.autoOptimize.autoCompact'   = 'true',
  'delta.dataSkippingStatsColumns'   = 'tenant_id,agent_id,trace_id,span_id,parent_span_id'
);
