-- Validate all silver tables and checkpoints.

-- 1) Table existence + type (should all be MANAGED or EXTERNAL, not STREAMING TABLE)
SELECT table_name, table_type
FROM system.information_schema.tables
WHERE table_catalog = 'clawtrace'
  AND table_schema  = 'silver'
  AND table_name IN ('events_all', 'pg_traces', 'pg_spans', 'pg_child_of_edges', '_checkpoint')
ORDER BY table_name;

-- 2) Checkpoint state
SELECT pipeline, last_run_ts FROM clawtrace.silver._checkpoint ORDER BY pipeline;

-- 3) Row count sanity check
SELECT 'events_all'        AS tbl, COUNT(*) AS row_count FROM clawtrace.silver.events_all
UNION ALL
SELECT 'pg_traces',                COUNT(*)              FROM clawtrace.silver.pg_traces
UNION ALL
SELECT 'pg_spans',                 COUNT(*)              FROM clawtrace.silver.pg_spans
UNION ALL
SELECT 'pg_child_of_edges',        COUNT(*)              FROM clawtrace.silver.pg_child_of_edges
ORDER BY tbl;

-- 4) events_all columns
SELECT ordinal_position, column_name, full_data_type
FROM system.information_schema.columns
WHERE table_catalog = 'clawtrace'
  AND table_schema  = 'silver'
  AND table_name    = 'events_all'
ORDER BY ordinal_position;
