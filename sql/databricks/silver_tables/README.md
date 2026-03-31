# ClawTrace Silver Tables (PuppyGraph-compatible, pure Lakeflow)

PuppyGraph currently cannot consume Databricks views in this environment.
This folder materializes the prior silver view layer into physical Lakeflow-managed tables
with the same table names and output columns.

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
In a Databricks Lakeflow SQL pipeline, run:

1. `sql/databricks/silver_tables/10_materialize_silver_tables.sql`
2. `sql/databricks/silver_tables/20_validate_silver_tables.sql`

Then set PuppyGraph schema to catalog `clawtrace`, database `silver`, and these 8 table names.

## Incremental behavior (managed by Lakeflow)
- No custom watermark table is used.
- Lakeflow pipeline checkpoints track processed source progress.
- First run backfills from the earliest available raw files under `abfss://.../clawtrace-raw/.../raw/v1/`.
- Later runs process only new raw-file deltas automatically.

## Important for Lakeflow SQL compatibility
`10_materialize_silver_tables.sql` is DLT-only by design and contains **only**
`CREATE OR REFRESH STREAMING TABLE` statements.

If you need cleanup/bootstrap (`CREATE SCHEMA`, `DROP VIEW`, etc.), run those one-time
commands in Databricks SQL Editor (outside the Lakeflow pipeline).

## Scheduling
Recommended: schedule the Lakeflow pipeline every **1-2 minutes**.
