-- ClawTrace events_all incremental ingest.
-- Run as a Databricks SQL Job on a schedule (every 3 min recommended).
-- NOT a DLT pipeline — produces a regular Delta table readable by PuppyGraph.
--
-- Strategy: MERGE on event_id for exact dedup. Reads raw files whose
-- modification time falls within a 10-minute lookback window from the last
-- checkpoint to tolerate late-arriving files without reprocessing everything.

-- ─────────────────────────────────────────────────────────────────────────────
-- SHADOW DUPLICATE FILTER (OpenClaw runtime behaviour)
--
-- OpenClaw fires after_tool_call twice for certain tools (exec, write,
-- sessions_spawn): once with full session context (3-5ms first, kept) and
-- once from a global hook path with no session, no runId, no toolCallId.
-- The second firing has no span linkage and always lands in sessionKey="unknown".
-- Fingerprint: event_type='tool_after_call' AND sessionKey='unknown'
--              AND toolCallId IS NULL.
-- This is precise — legitimate after_tool_call events always carry a toolCallId
-- from the plugin's anonymous queue (anon-N-uuid pattern).
-- ─────────────────────────────────────────────────────────────────────────────
-- QUERY PATTERNS & OPTIMIZATIONS (defined on the table in 00_bootstrap)
--
-- Primary access hierarchy: tenant_id → agent_id → trace_id → span_id
-- CLUSTER BY (tenant_id, agent_id, trace_id): co-locates all events for a
--   trace in the same files — covers vertex lookups and graph traversals.
-- dataSkippingStatsColumns: excludes payload_json (large text, never filtered).
-- event_date: DATE derived from event_ts_ms for time-range pruning.
-- autoOptimize + autoCompact: prevents small-file accumulation from 3-min runs.
-- Bloom filters: attempted on trace_id/span_id/event_id in DLT context but
--   rejected by Unity Catalog. May work on regular Delta tables — see bootstrap.
-- ─────────────────────────────────────────────────────────────────────────────

MERGE INTO clawtrace.silver.events_all AS t
USING (
  WITH raw_src AS (
    SELECT
      current_timestamp()                                                         AS ingest_ts,
      NULLIF(regexp_extract(_metadata.file_path, 'tenant=([^/]+)', 1), '')        AS tenant_id,
      agentId                                                                     AS agent_id,
      event.eventId                                                               AS event_id,
      event.eventType                                                             AS event_type,
      event.traceId                                                               AS trace_id,
      event.spanId                                                                AS span_id,
      event.parentSpanId                                                          AS parent_span_id,
      CAST(event.tsMs AS BIGINT)                                                  AS event_ts_ms,
      DATE(TIMESTAMP_MILLIS(CAST(event.tsMs AS BIGINT)))                          AS event_date,
      _metadata.file_path                                                         AS raw_path,
      CASE WHEN event.payload IS NULL THEN NULL
           ELSE CAST(to_json(event.payload) AS STRING) END                        AS payload_json
    FROM read_files(
      'abfss://clawtrace-raw@clawtracelake01.dfs.core.windows.net/raw/v1/',
      format => 'json',
      -- 10-min lookback buffer handles late-arriving files without full scan
      modifiedAfter => (
        SELECT TIMESTAMPADD(MINUTE, -10, last_run_ts)
        FROM clawtrace.silver._checkpoint
        WHERE pipeline = 'events'
      )
    )
    WHERE event.eventId  IS NOT NULL
      AND event.eventType IS NOT NULL
      -- Drop OpenClaw shadow duplicates (see SHADOW DUPLICATE FILTER note above)
      AND NOT (
        event.eventType = 'tool_after_call'
        AND get_json_object(CAST(to_json(event.payload) AS STRING), '$.sessionKey') = 'unknown'
        AND get_json_object(CAST(to_json(event.payload) AS STRING), '$.toolCallId') IS NULL
      )
  )
  SELECT
    ingest_ts, tenant_id, agent_id, event_id, event_type,
    trace_id, span_id, parent_span_id, event_ts_ms, event_date,
    COALESCE(
      NULLIF(get_json_object(payload_json, '$.name'), ''),
      NULLIF(get_json_object(payload_json, '$.spanName'), ''),
      NULLIF(get_json_object(payload_json, '$.span_name'), '')
    )                                                           AS span_name,
    COALESCE(
      NULLIF(get_json_object(payload_json, '$.toolName'), ''),
      NULLIF(get_json_object(payload_json, '$.tool_name'), ''),
      NULLIF(get_json_object(payload_json, '$.tool'), ''),
      NULLIF(get_json_object(payload_json, '$.toolCall.name'), ''),
      NULLIF(get_json_object(payload_json, '$.tool_call.name'), ''),
      CASE WHEN event_type LIKE 'tool_%'
           THEN NULLIF(get_json_object(payload_json, '$.model'), '') END
    )                                                           AS tool_name,
    COALESCE(
      NULLIF(get_json_object(payload_json, '$.model'), ''),
      NULLIF(get_json_object(payload_json, '$.modelName'), ''),
      NULLIF(get_json_object(payload_json, '$.model_name'), '')
    )                                                           AS model_name,
    payload_json,
    raw_path
  FROM raw_src
) AS s
ON t.event_id = s.event_id
WHEN NOT MATCHED THEN INSERT *;

-- Advance checkpoint to now so the next run only reads new files
UPDATE clawtrace.silver._checkpoint
SET    last_run_ts = current_timestamp()
WHERE  pipeline = 'events';
