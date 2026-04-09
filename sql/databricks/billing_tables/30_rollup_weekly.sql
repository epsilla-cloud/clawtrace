-- ============================================================================
-- ClawTrace Billing — Weekly Rollup
-- ============================================================================
-- Aggregates billing_usage_daily into billing_usage_weekly.
-- Uses MERGE — safe to run at any frequency.
-- ============================================================================

MERGE INTO clawtrace.billing.billing_usage_weekly AS tgt
USING (
    SELECT
        user_id,
        category,
        date_trunc('week', day_bucket)  AS week_bucket,
        SUM(total_credits)              AS total_credits,
        SUM(total_raw)                  AS total_raw,
        SUM(event_count)                AS event_count
    FROM clawtrace.billing.billing_usage_daily
    WHERE day_bucket >= CAST(COALESCE(
        (SELECT watermark FROM clawtrace.billing.billing_checkpoint WHERE pipeline = 'rollup_weekly'),
        TIMESTAMP '1970-01-01'
    ) AS DATE)
    GROUP BY user_id, category, date_trunc('week', day_bucket)
) AS src
ON tgt.user_id = src.user_id
   AND tgt.category = src.category
   AND tgt.week_bucket = src.week_bucket
WHEN MATCHED THEN UPDATE SET
    total_credits = src.total_credits,
    total_raw     = src.total_raw,
    event_count   = src.event_count
WHEN NOT MATCHED THEN INSERT (user_id, category, week_bucket, total_credits, total_raw, event_count)
    VALUES (src.user_id, src.category, src.week_bucket, src.total_credits, src.total_raw, src.event_count);

-- Advance checkpoint
MERGE INTO clawtrace.billing.billing_checkpoint AS tgt
USING (SELECT 'rollup_weekly' AS pipeline, current_timestamp() AS watermark) AS src
ON tgt.pipeline = src.pipeline
WHEN MATCHED THEN UPDATE SET watermark = src.watermark
WHEN NOT MATCHED THEN INSERT (pipeline, watermark) VALUES (src.pipeline, src.watermark);
