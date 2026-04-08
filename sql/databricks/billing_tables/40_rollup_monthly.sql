-- ============================================================================
-- ClawTrace Billing — Monthly Rollup
-- ============================================================================
-- Aggregates billing_usage_daily into billing_usage_monthly.
-- Uses DELETE+INSERT pattern — safe to run at any frequency.
-- Schedule: once per month (but safe to run weekly or daily)
-- ============================================================================

-- Step 1: Determine which months have changed since last rollup
CREATE OR REPLACE TEMPORARY VIEW changed_months AS
SELECT DISTINCT
    user_id,
    date_trunc('month', day_bucket) AS month_bucket
FROM billing_usage_daily
WHERE day_bucket >= CAST((
    SELECT COALESCE(
        (SELECT watermark FROM billing_checkpoint WHERE pipeline = 'rollup_monthly'),
        TIMESTAMP '1970-01-01'
    )
) AS DATE);

-- Step 2: Delete stale monthly rows
DELETE FROM billing_usage_monthly
WHERE (user_id, month_bucket) IN (
    SELECT user_id, month_bucket FROM changed_months
);

-- Step 3: Insert fresh aggregation
INSERT INTO billing_usage_monthly
SELECT
    d.user_id,
    d.category,
    date_trunc('month', d.day_bucket)  AS month_bucket,
    SUM(d.total_credits)               AS total_credits,
    SUM(d.total_raw)                   AS total_raw,
    SUM(d.event_count)                 AS event_count
FROM billing_usage_daily d
INNER JOIN changed_months c
    ON d.user_id = c.user_id
   AND date_trunc('month', d.day_bucket) = c.month_bucket
GROUP BY d.user_id, d.category, date_trunc('month', d.day_bucket);

-- Step 4: Advance checkpoint
MERGE INTO billing_checkpoint AS tgt
USING (SELECT 'rollup_monthly' AS pipeline, current_timestamp() AS watermark) AS src
ON tgt.pipeline = src.pipeline
WHEN MATCHED THEN UPDATE SET watermark = src.watermark
WHEN NOT MATCHED THEN INSERT (pipeline, watermark) VALUES (src.pipeline, src.watermark);
