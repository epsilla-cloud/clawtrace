-- ============================================================================
-- ClawTrace Billing — Daily Rollup
-- ============================================================================
-- Aggregates clawtrace.billing.billing_usage_hourly into clawtrace.billing.billing_usage_daily.
-- Safe to run at any frequency — uses DELETE+INSERT (not MERGE) to avoid
-- merge failures from duplicate keys. Each run recomputes all affected days.
-- Schedule: once per day (but safe to run more often)
-- ============================================================================

-- Step 1: Determine which days have changed since last rollup
CREATE OR REPLACE TEMPORARY VIEW changed_days AS
SELECT DISTINCT
    user_id,
    CAST(hour_bucket AS DATE) AS day_bucket
FROM clawtrace.billing.billing_usage_hourly
WHERE hour_bucket >= (
    SELECT COALESCE(
        (SELECT watermark FROM clawtrace.billing.billing_checkpoint WHERE pipeline = 'rollup_daily'),
        TIMESTAMP '1970-01-01'
    )
);

-- Step 2: Delete stale daily rows for changed days
DELETE FROM clawtrace.billing.billing_usage_daily
WHERE (user_id, day_bucket) IN (
    SELECT user_id, day_bucket FROM changed_days
);

-- Step 3: Insert fresh aggregation for changed days
INSERT INTO clawtrace.billing.billing_usage_daily
SELECT
    h.user_id,
    h.category,
    CAST(h.hour_bucket AS DATE)  AS day_bucket,
    SUM(h.total_credits)         AS total_credits,
    SUM(h.total_raw)             AS total_raw,
    SUM(h.event_count)           AS event_count
FROM clawtrace.billing.billing_usage_hourly h
INNER JOIN changed_days c
    ON h.user_id = c.user_id
   AND CAST(h.hour_bucket AS DATE) = c.day_bucket
GROUP BY h.user_id, h.category, CAST(h.hour_bucket AS DATE);

-- Step 4: Advance checkpoint
MERGE INTO clawtrace.billing.billing_checkpoint AS tgt
USING (SELECT 'rollup_daily' AS pipeline, current_timestamp() AS watermark) AS src
ON tgt.pipeline = src.pipeline
WHEN MATCHED THEN UPDATE SET watermark = src.watermark
WHEN NOT MATCHED THEN INSERT (pipeline, watermark) VALUES (src.pipeline, src.watermark);
