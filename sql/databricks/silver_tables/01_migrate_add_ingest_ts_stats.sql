-- One-time migration: add ingest_ts to dataSkippingStatsColumns on events_all.
--
-- WHY:
--   Job 20 (pg_* table refresh) filters exclusively on ingest_ts:
--     WHERE ingest_ts > (SELECT last_run_ts FROM _checkpoint ...)
--   Without min/max stats on ingest_ts, Delta opens every file on every run
--   (full scan). Since ingest_ts = current_timestamp() at write time and
--   events_all is append-only, newer files have consistently higher min
--   ingest_ts values — stats are highly effective at skipping old files.
--
-- WHAT THIS DOES:
--   1. ALTER TABLE: applies the new dataSkippingStatsColumns to future writes.
--      New files written after this will have ingest_ts stats automatically.
--
--   2. OPTIMIZE: rewrites all existing files according to the current
--      CLUSTER BY and collects stats for ALL dataSkippingStatsColumns
--      (including the newly added ingest_ts). This backfills stats on
--      existing data so old files can also be skipped immediately.
--
-- DATA IMPACT:
--   - No data is lost or changed — OPTIMIZE rewrites Parquet files in place.
--   - No re-ingestion needed.
--   - The table stays queryable during OPTIMIZE (Delta MVCC).
--   - Estimated duration: a few minutes for small tables, longer for large ones.
--
-- RUN ONCE in Databricks SQL Editor after deploying the bootstrap change.

ALTER TABLE clawtrace.silver.events_all
SET TBLPROPERTIES (
  'delta.dataSkippingStatsColumns' =
    'ingest_ts,tenant_id,agent_id,event_id,event_type,trace_id,span_id,parent_span_id,event_ts_ms,tool_name,model_name,event_date'
);

-- Rewrite existing files to backfill ingest_ts stats on historical data.
-- Without this, only new files (written after the ALTER TABLE) benefit.
OPTIMIZE clawtrace.silver.events_all;
