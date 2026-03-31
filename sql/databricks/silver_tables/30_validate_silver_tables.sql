-- Validate both pipelines: events_all (pipeline 10) and PuppyGraph tables (pipeline 20).

-- 1) All silver tables + types
SELECT table_name, table_type
FROM system.information_schema.tables
WHERE table_catalog = 'clawtrace'
  AND table_schema = 'silver'
  AND table_name IN ('events_all', 'pg_traces', 'pg_spans', 'pg_child_of_edges')
ORDER BY table_name;

-- 2) events_all columns
SELECT ordinal_position, column_name, full_data_type
FROM system.information_schema.columns
WHERE table_catalog = 'clawtrace'
  AND table_schema = 'silver'
  AND table_name = 'events_all'
ORDER BY ordinal_position;

-- 3) pg_traces columns
SELECT ordinal_position, column_name, full_data_type
FROM system.information_schema.columns
WHERE table_catalog = 'clawtrace'
  AND table_schema = 'silver'
  AND table_name = 'pg_traces'
ORDER BY ordinal_position;

-- 4) pg_spans columns
SELECT ordinal_position, column_name, full_data_type
FROM system.information_schema.columns
WHERE table_catalog = 'clawtrace'
  AND table_schema = 'silver'
  AND table_name = 'pg_spans'
ORDER BY ordinal_position;

-- 5) pg_child_of_edges columns
SELECT ordinal_position, column_name, full_data_type
FROM system.information_schema.columns
WHERE table_catalog = 'clawtrace'
  AND table_schema = 'silver'
  AND table_name = 'pg_child_of_edges'
ORDER BY ordinal_position;

-- 6) Quick row count sanity check
SELECT 'events_all'       AS tbl, COUNT(*) AS row_count FROM clawtrace.silver.events_all
UNION ALL
SELECT 'pg_traces',                COUNT(*)              FROM clawtrace.silver.pg_traces
UNION ALL
SELECT 'pg_spans',                 COUNT(*)              FROM clawtrace.silver.pg_spans
UNION ALL
SELECT 'pg_child_of_edges',        COUNT(*)              FROM clawtrace.silver.pg_child_of_edges
ORDER BY tbl;
