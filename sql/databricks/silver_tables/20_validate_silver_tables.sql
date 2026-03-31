-- Validate table existence, table type, and output columns.

-- 1) table existence + type
SELECT table_name, table_type
FROM system.information_schema.tables
WHERE table_catalog = 'clawtrace'
  AND table_schema = 'silver'
  AND table_name IN (
    'events_all',
    'pg_agent_span_edges',
    'pg_agents',
    'pg_span_parent_edges',
    'pg_spans',
    'pg_trace_span_edges',
    'pg_traces',
    'span_rollup'
  )
ORDER BY table_name;

-- 2) events_all columns
SELECT ordinal_position, column_name, full_data_type
FROM system.information_schema.columns
WHERE table_catalog = 'clawtrace'
  AND table_schema = 'silver'
  AND table_name = 'events_all'
ORDER BY ordinal_position;

-- 3) pg_agents columns
SELECT ordinal_position, column_name, full_data_type
FROM system.information_schema.columns
WHERE table_catalog = 'clawtrace'
  AND table_schema = 'silver'
  AND table_name = 'pg_agents'
ORDER BY ordinal_position;

-- 4) pg_traces columns
SELECT ordinal_position, column_name, full_data_type
FROM system.information_schema.columns
WHERE table_catalog = 'clawtrace'
  AND table_schema = 'silver'
  AND table_name = 'pg_traces'
ORDER BY ordinal_position;

-- 5) span_rollup columns
SELECT ordinal_position, column_name, full_data_type
FROM system.information_schema.columns
WHERE table_catalog = 'clawtrace'
  AND table_schema = 'silver'
  AND table_name = 'span_rollup'
ORDER BY ordinal_position;

-- 6) pg_spans columns
SELECT ordinal_position, column_name, full_data_type
FROM system.information_schema.columns
WHERE table_catalog = 'clawtrace'
  AND table_schema = 'silver'
  AND table_name = 'pg_spans'
ORDER BY ordinal_position;

-- 7) edge tables columns
SELECT table_name, ordinal_position, column_name, full_data_type
FROM system.information_schema.columns
WHERE table_catalog = 'clawtrace'
  AND table_schema = 'silver'
  AND table_name IN ('pg_trace_span_edges', 'pg_agent_span_edges', 'pg_span_parent_edges')
ORDER BY table_name, ordinal_position;
