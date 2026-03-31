-- Validate table existence, table type, and output columns.
-- Only events_all is active. Deferred tables are listed in 10_materialize_silver_tables.sql.

-- 1) table existence + type
SELECT table_name, table_type
FROM system.information_schema.tables
WHERE table_catalog = 'clawtrace'
  AND table_schema = 'silver'
  AND table_name = 'events_all'
ORDER BY table_name;

-- 2) events_all columns
SELECT ordinal_position, column_name, full_data_type
FROM system.information_schema.columns
WHERE table_catalog = 'clawtrace'
  AND table_schema = 'silver'
  AND table_name = 'events_all'
ORDER BY ordinal_position;
