-- ============================================================================
-- ClawTrace Billing — Weekly Rollup
-- ============================================================================
-- Aggregates billing_usage_daily into billing_usage_weekly.
-- Uses DELETE+INSERT pattern — safe to run at any frequency.
-- Schedule: once per week (but safe to run daily)
-- ============================================================================

-- Step 1: Determine which weeks have changed since last rollup
CREATE OR REPLACE TEMPORARY VIEW changed_weeks AS
SELECT DISTINCT
    user_id,
    date_trunc('week', day_bucket) AS week_bucket
FROM billing_usage_daily
WHERE day_bucket >= CAST((
    SELECT COALESCE(
        (SELECT watermark FROM billing_checkpoint WHERE pipeline = 'rollup_weekly'),
        TIMESTAMP '1970-01-01'
    )
) AS DATE);

-- Step 2: Delete stale weekly rows
DELETE FROM billing_usage_weekly
WHERE (user_id, week_bucket) IN (
    SELECT user_id, week_bucket FROM changed_weeks
);

-- Step 3: Insert fresh aggregation
INSERT INTO billing_usage_weekly
SELECT
    d.user_id,
    d.category,
    date_trunc('week', d.day_bucket)  AS week_bucket,
    SUM(d.total_credits)              AS total_credits,
    SUM(d.total_raw)                  AS total_raw,
    SUM(d.event_count)                AS event_count
FROM billing_usage_daily d
INNER JOIN changed_weeks c
    ON d.user_id = c.user_id
   AND date_trunc('week', d.day_bucket) = c.week_bucket
GROUP BY d.user_id, d.category, date_trunc('week', d.day_bucket);

-- Step 4: Advance checkpoint
MERGE INTO billing_checkpoint AS tgt
USING (SELECT 'rollup_weekly' AS pipeline, current_timestamp() AS watermark) AS src
ON tgt.pipeline = src.pipeline
WHEN MATCHED THEN UPDATE SET watermark = src.watermark
WHEN NOT MATCHED THEN INSERT (pipeline, watermark) VALUES (src.pipeline, src.watermark);
