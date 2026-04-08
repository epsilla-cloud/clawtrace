-- ============================================================================
-- ClawTrace Billing Events — Ingest from audit JSON files
-- ============================================================================
-- Reads JSON audit logs from clawtrace-billing container and flattens
-- the cost_breakdown into individual rows per category.
-- Schedule: every 30 minutes (aligned with harvest frequency)
-- ============================================================================

-- PREREQUISITE: Add storage account key to SQL Warehouse → Advanced Options →
-- Data Access Configuration:
--   fs.azure.account.key.clawtracelake01.dfs.core.windows.net = <key>

-- Step 1: Read new audit JSON files since last checkpoint
CREATE OR REPLACE TEMPORARY VIEW new_audit_files AS
SELECT
    _metadata.file_path                                       AS file_path,
    _metadata.file_modification_time                          AS file_mod_time,
    get_json_object(value, '$.id')                            AS event_id,
    get_json_object(value, '$.user_id')                       AS user_id,
    CAST(get_json_object(value, '$.amount') AS DOUBLE)        AS amount,
    CAST(get_json_object(value, '$.balance_after') AS DOUBLE) AS balance_after,
    get_json_object(value, '$.type')                          AS event_type,
    get_json_object(value, '$.cost_breakdown')                AS cost_breakdown_json,
    CAST(get_json_object(value, '$.created_at') AS TIMESTAMP) AS created_at
FROM read_files(
    'abfss://clawtrace-billing@clawtracelake01.dfs.core.windows.net/billing/v1/',
    format => 'text',
    recursiveFileLookup => true
)
WHERE _metadata.file_modification_time > (
    SELECT watermark FROM billing_checkpoint WHERE pipeline = 'usage_ingest'
);

-- Step 2: Flatten cost_breakdown into per-category rows
CREATE OR REPLACE TEMPORARY VIEW flattened_events AS
SELECT
    event_id,
    user_id,
    amount,
    balance_after,
    event_type,
    cat.key                                                   AS category,
    CAST(get_json_object(cat.value, '$.raw_amount') AS DOUBLE)    AS raw_amount,
    CAST(get_json_object(cat.value, '$.rate') AS DOUBLE)          AS rate,
    CAST(get_json_object(cat.value, '$.credits_spent') AS DOUBLE) AS credits_spent,
    created_at,
    current_timestamp()                                       AS ingest_ts
FROM new_audit_files
LATERAL VIEW OUTER explode(
    from_json(cost_breakdown_json, 'MAP<STRING, STRING>')
) cat AS key, value
WHERE event_type = 'harvest'
  AND cost_breakdown_json IS NOT NULL;

-- Step 3: MERGE into billing_events (dedup on event_id + category)
MERGE INTO billing_events AS tgt
USING (
    SELECT * FROM flattened_events
    WHERE event_id IS NOT NULL
) AS src
ON tgt.event_id = src.event_id AND tgt.category = src.category
WHEN NOT MATCHED THEN
    INSERT (event_id, user_id, amount, balance_after, event_type,
            category, raw_amount, rate, credits_spent, created_at, ingest_ts)
    VALUES (src.event_id, src.user_id, src.amount, src.balance_after, src.event_type,
            src.category, src.raw_amount, src.rate, src.credits_spent, src.created_at, src.ingest_ts);

-- Step 4: Rebuild hourly aggregation for affected users
MERGE INTO billing_usage_hourly AS tgt
USING (
    SELECT
        user_id,
        category,
        date_trunc('hour', created_at)     AS hour_bucket,
        SUM(credits_spent)                 AS total_credits,
        SUM(raw_amount)                    AS total_raw,
        COUNT(*)                           AS event_count
    FROM billing_events
    WHERE user_id IN (SELECT DISTINCT user_id FROM flattened_events)
    GROUP BY user_id, category, date_trunc('hour', created_at)
) AS src
ON tgt.user_id = src.user_id
   AND tgt.category = src.category
   AND tgt.hour_bucket = src.hour_bucket
WHEN MATCHED THEN
    UPDATE SET
        total_credits = src.total_credits,
        total_raw     = src.total_raw,
        event_count   = src.event_count
WHEN NOT MATCHED THEN
    INSERT (user_id, category, hour_bucket, total_credits, total_raw, event_count)
    VALUES (src.user_id, src.category, src.hour_bucket, src.total_credits, src.total_raw, src.event_count);

-- Step 5: Advance checkpoint
UPDATE billing_checkpoint
SET watermark = current_timestamp()
WHERE pipeline = 'usage_ingest';
