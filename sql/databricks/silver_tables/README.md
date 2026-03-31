# ClawTrace Silver Tables (PuppyGraph-compatible, incremental)

PuppyGraph currently cannot consume Databricks views in this environment.
This folder materializes the previous silver view layer into physical Delta tables
with the same table names and the same output columns.

## Tables materialized
- `clawtrace.silver.events_all`
- `clawtrace.silver.pg_agent_span_edges`
- `clawtrace.silver.pg_agents`
- `clawtrace.silver.pg_span_parent_edges`
- `clawtrace.silver.pg_spans`
- `clawtrace.silver.pg_trace_span_edges`
- `clawtrace.silver.pg_traces`
- `clawtrace.silver.span_rollup`

## How to run
In Databricks SQL Editor, run:

1. `sql/databricks/silver_tables/10_materialize_silver_tables.sql`
2. `sql/databricks/silver_tables/20_validate_silver_tables.sql`

Then set your PuppyGraph schema to use catalog `clawtrace`, database `silver`, and these 8 table names.

## Incremental behavior
- The script keeps a watermark in `clawtrace.silver.__materialization_state`.
- Every run reads only bronze rows where `ingest_ts > watermark`.
- `events_all` is upserted by `event_id`.
- Downstream graph tables are refreshed only for impacted spans/traces/agents from the new delta.
- First run backfills from the beginning because watermark defaults to `1970-01-01`.

## Scheduling
Recommended: create a Databricks Job with one SQL task executing
`10_materialize_silver_tables.sql` every 1-2 minutes.
