-- ============================================================================
-- ClawTrace Billing — Daily Rollup
-- ============================================================================
-- Aggregates billing_usage_hourly into billing_usage_daily.
-- Uses MERGE with full recomputation of changed days.
-- Safe to run at any frequency.
-- ============================================================================

-- Recompute daily aggregation for all data since last checkpoint
MERGE INTO clawtrace.billing.billing_usage_daily AS tgt
USING (
    SELECT
        user_id,
        category,
        CAST(hour_bucket AS DATE)  AS day_bucket,
        SUM(total_credits)         AS total_credits,
        SUM(total_raw)             AS total_raw,
        SUM(event_count)           AS event_count
    FROM clawtrace.billing.billing_usage_hourly
    WHERE hour_bucket >= COALESCE(
        (SELECT watermark FROM clawtrace.billing.billing_checkpoint WHERE pipeline = 'rollup_daily'),
        TIMESTAMP '1970-01-01'
    )
    GROUP BY user_id, category, CAST(hour_bucket AS DATE)
) AS src
ON tgt.user_id = src.user_id
   AND tgt.category = src.category
   AND tgt.day_bucket = src.day_bucket
WHEN MATCHED THEN UPDATE SET
    total_credits = src.total_credits,
    total_raw     = src.total_raw,
    event_count   = src.event_count
WHEN NOT MATCHED THEN INSERT (user_id, category, day_bucket, total_credits, total_raw, event_count)
    VALUES (src.user_id, src.category, src.day_bucket, src.total_credits, src.total_raw, src.event_count);

-- Advance checkpoint
MERGE INTO clawtrace.billing.billing_checkpoint AS tgt
USING (SELECT 'rollup_daily' AS pipeline, current_timestamp() AS watermark) AS src
ON tgt.pipeline = src.pipeline
WHEN MATCHED THEN UPDATE SET watermark = src.watermark
WHEN NOT MATCHED THEN INSERT (pipeline, watermark) VALUES (src.pipeline, src.watermark);
