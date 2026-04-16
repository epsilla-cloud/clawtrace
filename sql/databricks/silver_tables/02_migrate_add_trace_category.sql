-- One-time migration: add category column to pg_traces.
--
-- WHY:
--   The backend was previously classifying traces as Heartbeat / Compact Memory
--   / Work by calling collect(input_payload) across all spans at query time in
--   PuppyGraph. On a 550-trace page load this caused 340-385 MB/s of Delta Lake
--   disk reads inside the PuppyGraph VM, which exhausted the 16 GB RAM (no swap)
--   and triggered an Azure Hyper-V graceful shutdown.
--
--   Moving classification to the Databricks ETL pipeline fixes this:
--   - Payload inspection happens once at ingest time, not on every page load.
--   - PuppyGraph returns a single pre-computed STRING column per trace.
--   - Query time is reduced from O(traces × spans) to O(1) column read.
--
-- WHAT THIS DOES:
--   1. ALTER TABLE: adds the category column to pg_traces.
--   2. UPDATE: backfills category for all existing rows by inspecting
--      session_start and llm_before_call payloads (first 2000 chars only).
--
-- RUN ONCE in Databricks SQL Editor after deploying job 20 changes.

ALTER TABLE clawtrace.silver.pg_traces
ADD COLUMN IF NOT EXISTS category STRING;

-- Backfill existing rows.
-- Only reads session_start + llm_before_call events (small subset),
-- and only the first 2000 chars of each payload (cheap string check).
UPDATE clawtrace.silver.pg_traces AS pt
SET category = (
  SELECT
    CASE
      WHEN MAX(CASE
        WHEN event_type IN ('session_start', 'llm_before_call')
          AND (
            lower(substring(payload_json, 1, 2000)) LIKE '%heartbeat%'
          )
        THEN 1 ELSE 0 END) = 1
      THEN 'Heartbeat'
      WHEN MAX(CASE
        WHEN event_type IN ('session_start', 'llm_before_call')
          AND (
            lower(substring(payload_json, 1, 2000)) LIKE '%pre-compaction%'
            OR lower(substring(payload_json, 1, 2000)) LIKE '%memory flush%'
          )
        THEN 1 ELSE 0 END) = 1
      THEN 'Compact Memory'
      ELSE 'Work'
    END
  FROM clawtrace.silver.events_all e
  WHERE e.trace_id  = pt.trace_id
    AND e.tenant_id = pt.tenant_id
)
WHERE category IS NULL;
