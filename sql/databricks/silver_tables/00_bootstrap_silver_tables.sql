-- ClawTrace silver layer bootstrap.
-- Run ONCE in Databricks SQL Editor before starting any jobs.
-- Creates regular Delta tables (not DLT) so PuppyGraph can read them.
--
-- WHY NOT DLT: PuppyGraph only reads standard Delta tables. DLT Streaming
-- Tables and Materialized Views are rejected even though they are backed by
-- Delta — PuppyGraph v0.113 does not recognise the DLT table metadata.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- GRAPH MODEL SUMMARY
--
-- Vertex: Agent    → manyToOne from events_all (no physical table needed)
-- Vertex: Trace    → pg_traces   (one row per trace, carries aggregated metrics)
-- Vertex: Span     → pg_spans    (one row per span,  carries tokens + cost)
-- Edge:   OWNS     → events_all  (every row has tenant_id + agent_id + trace_id)
-- Edge:   HAS_SPAN → events_all  (every row has trace_id + span_id)
-- Edge:   CHILD_OF → pg_child_of_edges (pre-filtered: parent_span_id IS NOT NULL)
--                    PuppyGraph has no inline WHERE filter — must be a physical table.
-- ─────────────────────────────────────────────────────────────────────────────
-- OPENCLAW DATA NOTES (learnt from raw event analysis)
--
-- Shadow duplicate filter (applied in job 10):
--   OpenClaw fires after_tool_call twice for certain tools (exec, write,
--   sessions_spawn): once with full session context (kept), and once from a
--   global hook path with no session, no runId, no toolCallId (3-5ms later).
--   The duplicate is identifiable: event_type='tool_after_call' AND
--   sessionKey='unknown' AND toolCallId IS NULL.
--
-- Span semantics:
--   Each span maps 1:1 to a single LLM invocation OR a single tool call.
--   Multiple LLM calls per span is impossible — each llm_before_call creates
--   a fresh spanId keyed to the runId.
--
-- Cost: NOT stored here. OpenClaw only reports raw token counts.
--   Cost is calculated on the UI side using a local pricing table.
--
-- Session/trace context recovery:
--   OpenClaw omits sessionKey from after_tool_call hook ctx. The plugin
--   (v0.1.3+) recovers it via a toolCallId→sessionKey map built at
--   before_tool_call time. Confirmed fixed in raw data from hr=22 onward.
--
-- subagent_spawn events:
--   subagent_spawning is a pre-spawn gate (can cancel) — fires BEFORE child
--   session exists. subagent_spawned fires AFTER confirmation (includes
--   child runId). Plugin v0.1.4+ emits subagent_spawn from subagent_spawned.
-- ─────────────────────────────────────────────────────────────────────────────
-- OPTIMIZATION RATIONALE
--
-- events_all:
--   CLUSTER BY (tenant_id, agent_id, trace_id) — covers the tenant→agent→trace
--   query hierarchy for all graph traversals. Agent list, agent drilldown, and
--   full trace fetch are all satisfied by this cluster order.
--   dataSkippingStatsColumns excludes payload_json: it is a large unstructured
--   string never used as a filter. Collecting min/max stats on it wastes
--   checkpoint space and slows commits.
--   event_date (DATE from event_ts_ms) added for efficient time-range pruning.
--
-- pg_traces:
--   CLUSTER BY (tenant_id, agent_id, trace_id) — same hierarchy as events_all.
--   All columns are small metrics; no columns excluded from stats.
--
-- pg_spans:
--   CLUSTER BY (trace_id, span_id) — primary PuppyGraph access is HAS_SPAN
--   traversal: fetch all spans within a trace. Point span lookup is secondary.
--   actor_type has only 3 values (model/tool/session) — clustering on it adds
--   no benefit and would break the trace-level co-location.
--   actor_label excluded from dataSkippingStatsColumns: it is a free-text
--   model/tool name (e.g. "gemini-3.1-pro-preview") never used as a range
--   filter. Including it wastes stats storage.
--
-- pg_child_of_edges:
--   CLUSTER BY (trace_id, parent_span_id) — most frequent graph traversal is
--   "find all children of span X in trace Y" which filters by parent_span_id.
--   Reverse lookup (find parent of span X) is secondary.
--
-- Bloom filters:
--   Attempted on trace_id, span_id, event_id in the earlier DLT implementation.
--   delta.bloomFilter.* TBLPROPERTIES were rejected in Databricks Unity Catalog
--   DLT pipelines even with allowArbitraryProperties=true. Regular Delta tables
--   (this approach) may support them — worth testing by adding:
--     'delta.bloomFilter.trace_id.enabled' = 'true',
--     'delta.bloomFilter.span_id.enabled'  = 'true',
--     'delta.bloomFilter.event_id.enabled' = 'true'
--   to the TBLPROPERTIES of events_all, pg_traces, pg_spans after creation.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE SCHEMA IF NOT EXISTS clawtrace.silver;

-- ── Checkpoint table ─────────────────────────────────────────────────────────
-- Tracks the last successful run for each pipeline so jobs only process
-- new files/rows. Seeded to epoch so the first run processes everything.

CREATE TABLE IF NOT EXISTS clawtrace.silver._checkpoint (
  pipeline    STRING    NOT NULL,
  last_run_ts TIMESTAMP NOT NULL
);

INSERT INTO clawtrace.silver._checkpoint
SELECT 'events',    TIMESTAMP '1970-01-01 00:00:00'
WHERE NOT EXISTS (SELECT 1 FROM clawtrace.silver._checkpoint WHERE pipeline = 'events');

INSERT INTO clawtrace.silver._checkpoint
SELECT 'pg_tables', TIMESTAMP '1970-01-01 00:00:00'
WHERE NOT EXISTS (SELECT 1 FROM clawtrace.silver._checkpoint WHERE pipeline = 'pg_tables');

-- ── events_all ───────────────────────────────────────────────────────────────
-- Append-only stream of raw OpenClaw hook events from ADLS.
-- Populated by job 10.

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
  event_date     DATE,     -- derived from event_ts_ms for time-range pruning
  span_name      STRING,
  tool_name      STRING,
  model_name     STRING,
  payload_json   STRING,   -- excluded from stats: large, never range-filtered
  raw_path       STRING
)
CLUSTER BY (tenant_id, agent_id, trace_id)
TBLPROPERTIES (
  'delta.autoOptimize.optimizeWrite' = 'true',
  'delta.autoOptimize.autoCompact'   = 'true',
  -- ingest_ts added: job 20 filters on ingest_ts > checkpoint on every run.
  -- Without stats, every file is opened (full scan). Since ingest_ts =
  -- current_timestamp() at write time and data is append-only, newer files
  -- consistently have higher min(ingest_ts), so stats are highly effective.
  'delta.dataSkippingStatsColumns'   = 'ingest_ts,tenant_id,agent_id,event_id,event_type,trace_id,span_id,parent_span_id,event_ts_ms,tool_name,model_name,event_date'
);

-- ── pg_traces ─────────────────────────────────────────────────────────────────
-- One row per trace. Carries aggregated duration + event_count for the Trace
-- vertex in PuppyGraph. Populated by job 20 via incremental MERGE.

CREATE TABLE IF NOT EXISTS clawtrace.silver.pg_traces (
  tenant_id         STRING NOT NULL,
  agent_id          STRING NOT NULL,
  trace_id          STRING NOT NULL,
  trace_start_ts_ms BIGINT,
  trace_end_ts_ms   BIGINT,
  duration_ms       BIGINT,
  event_count       BIGINT,
  trace_date        DATE,
  agent_name        STRING,  -- OpenClaw agent identity (e.g. "main", "codex") parsed from sessionKey
  session_key       STRING   -- OpenClaw sessionKey for grouping loops by conversation
)
CLUSTER BY (tenant_id, agent_id, trace_id)
TBLPROPERTIES (
  'delta.autoOptimize.optimizeWrite' = 'true',
  'delta.autoOptimize.autoCompact'   = 'true',
  'delta.dataSkippingStatsColumns'   = 'tenant_id,agent_id,trace_id,trace_start_ts_ms,trace_end_ts_ms,duration_ms,trace_date'
);

-- ── pg_spans ──────────────────────────────────────────────────────────────────
-- One row per span. Carries per-span metrics for the Span vertex in PuppyGraph.
-- Each span wraps exactly one LLM call or one tool call (1:1 by plugin design).
-- Cost is NOT stored — calculated on the UI side from model + tokens.

CREATE TABLE IF NOT EXISTS clawtrace.silver.pg_spans (
  tenant_id        STRING NOT NULL,
  agent_id         STRING NOT NULL,
  trace_id         STRING NOT NULL,
  span_id          STRING NOT NULL,
  parent_span_id   STRING,
  span_start_ts_ms BIGINT,
  span_end_ts_ms   BIGINT,
  duration_ms      BIGINT,
  actor_label      STRING,  -- free-text model/tool name, excluded from stats
  actor_type       STRING,  -- 'llm_call' | 'tool_call' | 'subagent' | 'session'
  input_tokens     BIGINT,
  output_tokens    BIGINT,
  total_tokens     BIGINT,
  has_error        INT,
  input_payload    STRING,  -- before-call payload (prompt, params)
  output_payload   STRING   -- after-call payload (result, response, usage)
)
CLUSTER BY (trace_id, span_id)
TBLPROPERTIES (
  'delta.autoOptimize.optimizeWrite' = 'true',
  'delta.autoOptimize.autoCompact'   = 'true',
  -- actor_label excluded: free-text model/tool name, never range-filtered
  'delta.dataSkippingStatsColumns'   = 'tenant_id,agent_id,trace_id,span_id,parent_span_id,actor_type,span_start_ts_ms,duration_ms,has_error'
);

-- ── pg_tenants ────────────────────────────────────────────────────────────────
-- One row per tenant. Serves as the Tenant vertex (top of the hierarchy) and
-- as the source for the HAS_AGENT edge (Tenant → Agent).
-- Single-column UUID key — no composite key needed since tenant_id is globally unique.

CREATE TABLE IF NOT EXISTS clawtrace.silver.pg_tenants (
  tenant_id STRING NOT NULL
)
TBLPROPERTIES (
  'delta.autoOptimize.optimizeWrite' = 'true',
  'delta.autoOptimize.autoCompact'   = 'true'
);

-- ── pg_agents ─────────────────────────────────────────────────────────────────
-- One row per agent. Serves as the Agent vertex and as the source for the
-- HAS_AGENT edge (Tenant → Agent) and OWNS edge (Agent → Trace).
-- Single-column UUID key — agent_id is globally unique.

CREATE TABLE IF NOT EXISTS clawtrace.silver.pg_agents (
  tenant_id STRING NOT NULL,
  agent_id  STRING NOT NULL
)
CLUSTER BY (tenant_id)
TBLPROPERTIES (
  'delta.autoOptimize.optimizeWrite' = 'true',
  'delta.autoOptimize.autoCompact'   = 'true',
  'delta.dataSkippingStatsColumns'   = 'tenant_id,agent_id'
);

-- ── pg_child_of_edges ─────────────────────────────────────────────────────────
-- Pre-filtered edge table: spans that have a parent (parent_span_id IS NOT NULL).
-- PuppyGraph has no inline WHERE filter support on edge tableSource — this
-- pre-filtered physical table is required. Populated by job 20 via MERGE.
-- Single-column UUID keys — span_id and parent_span_id are globally unique.

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
