-- ============================================================================
-- ClawTrace Billing Tables — Bootstrap (run once)
-- ============================================================================
-- Creates tables under clawtrace.billing schema for credit usage aggregation
-- from audit logs in Azure Blob (clawtrace-billing container).
--
-- Prerequisites:
--   1. CREATE SCHEMA IF NOT EXISTS clawtrace.billing;
--   2. External location registered for clawtrace-billing container
--      (same storage credential as clawtrace-raw)
-- ============================================================================

-- 1. Checkpoint table for incremental processing
CREATE TABLE IF NOT EXISTS clawtrace.billing.billing_checkpoint (
    pipeline    STRING NOT NULL,
    watermark   TIMESTAMP NOT NULL
)
USING DELTA
TBLPROPERTIES (
    'delta.autoOptimize.optimizeWrite' = 'true',
    'delta.autoOptimize.autoCompact'   = 'true'
);

-- Seed checkpoint
INSERT INTO clawtrace.billing.billing_checkpoint
SELECT 'usage_ingest', TIMESTAMP '1970-01-01 00:00:00'
WHERE NOT EXISTS (SELECT 1 FROM clawtrace.billing.billing_checkpoint WHERE pipeline = 'usage_ingest');

-- 2. Raw billing events — append-only from audit JSON files
CREATE TABLE IF NOT EXISTS clawtrace.billing.billing_events (
    event_id        STRING NOT NULL,
    user_id         STRING NOT NULL,
    amount          DOUBLE NOT NULL,
    balance_after   DOUBLE,
    event_type      STRING NOT NULL,
    category        STRING,
    raw_amount      DOUBLE,
    rate            DOUBLE,
    credits_spent   DOUBLE,
    created_at      TIMESTAMP NOT NULL,
    ingest_ts       TIMESTAMP NOT NULL
)
USING DELTA
CLUSTER BY (user_id, created_at)
TBLPROPERTIES (
    'delta.autoOptimize.optimizeWrite' = 'true',
    'delta.autoOptimize.autoCompact'   = 'true'
);

-- 3. Hourly aggregation per tenant per category
CREATE TABLE IF NOT EXISTS clawtrace.billing.billing_usage_hourly (
    user_id         STRING NOT NULL,
    category        STRING NOT NULL,
    hour_bucket     TIMESTAMP NOT NULL,
    total_credits   DOUBLE NOT NULL,
    total_raw       DOUBLE NOT NULL,
    event_count     BIGINT NOT NULL
)
USING DELTA
CLUSTER BY (user_id, hour_bucket)
TBLPROPERTIES (
    'delta.autoOptimize.optimizeWrite' = 'true',
    'delta.autoOptimize.autoCompact'   = 'true'
);

-- 4. Daily rollup
CREATE TABLE IF NOT EXISTS clawtrace.billing.billing_usage_daily (
    user_id         STRING NOT NULL,
    category        STRING NOT NULL,
    day_bucket      DATE NOT NULL,
    total_credits   DOUBLE NOT NULL,
    total_raw       DOUBLE NOT NULL,
    event_count     BIGINT NOT NULL
)
USING DELTA
CLUSTER BY (user_id, day_bucket)
TBLPROPERTIES (
    'delta.autoOptimize.optimizeWrite' = 'true',
    'delta.autoOptimize.autoCompact'   = 'true'
);

-- 5. Weekly rollup
CREATE TABLE IF NOT EXISTS clawtrace.billing.billing_usage_weekly (
    user_id         STRING NOT NULL,
    category        STRING NOT NULL,
    week_bucket     TIMESTAMP NOT NULL,
    total_credits   DOUBLE NOT NULL,
    total_raw       DOUBLE NOT NULL,
    event_count     BIGINT NOT NULL
)
USING DELTA
CLUSTER BY (user_id, week_bucket)
TBLPROPERTIES (
    'delta.autoOptimize.optimizeWrite' = 'true',
    'delta.autoOptimize.autoCompact'   = 'true'
);

-- 6. Monthly rollup
CREATE TABLE IF NOT EXISTS clawtrace.billing.billing_usage_monthly (
    user_id         STRING NOT NULL,
    category        STRING NOT NULL,
    month_bucket    TIMESTAMP NOT NULL,
    total_credits   DOUBLE NOT NULL,
    total_raw       DOUBLE NOT NULL,
    event_count     BIGINT NOT NULL
)
USING DELTA
CLUSTER BY (user_id, month_bucket)
TBLPROPERTIES (
    'delta.autoOptimize.optimizeWrite' = 'true',
    'delta.autoOptimize.autoCompact'   = 'true'
);
