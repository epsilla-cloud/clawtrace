"""Payment service configuration — all values configurable via env vars."""

from __future__ import annotations

from enum import Enum

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class StorageProvider(str, Enum):
    AZURE_BLOB = "azure_blob"
    GCS = "gcs"
    AWS_S3 = "aws_s3"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="CLAWTRACE_PAYMENT_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Server
    host: str = "0.0.0.0"
    port: int = 8083
    log_level: str = "INFO"

    # Auth (shared JWT with backend/UI)
    jwt_secret: str = "REDACTED"
    jwt_algorithm: str = "HS256"
    jwt_cookie_name: str = "auth_token"
    internal_secret: str = "REDACTED"

    # Database (Neon PostgreSQL)
    database_url: str = ""

    # Stripe
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""

    # Credits
    default_signup_credits: float = 200.0
    referral_new_user_credits: float = 100.0
    referral_referrer_credits: float = 100.0
    credit_expiration_days: int = 365
    low_credit_threshold: float = 50.0

    # Credit packages (JSON array — each: id, label, price_usd, credits, badge)
    # badge is optional marketing text (e.g. "Best Value")
    credit_packages_json: str = (
        '['
        '{"id":"starter","label":"Starter","price_usd":10,"credits":1000},'
        '{"id":"growth","label":"Growth","price_usd":50,"credits":5000},'
        '{"id":"pro","label":"Pro","price_usd":90,"credits":10000,"badge":"10% Off"},'
        '{"id":"scale","label":"Scale","price_usd":400,"credits":50000,"badge":"Best Value"}'
        ']'
    )

    # Pricing table: line_item -> credits per unit (JSON string)
    # - tracy tokens: Tracy agent chat (not user trace LLM tokens)
    # - storage_mb: per MB of raw trace storage per day (5x markup)
    # - trace_list_query: per GET /v1/traces call
    # - trace_detail_query: per GET /v1/traces/{id} call
    pricing_table_json: str = (
        '{"tracy_input_token_1k": 0.5, "tracy_output_token_1k": 2.5,'
        ' "storage_mb_day": 1.35, "trace_list_query": 0.5,'
        ' "trace_detail_query": 0.2}'
    )

    # Scheduler intervals (seconds)
    harvest_interval_seconds: int = 1800
    notification_interval_seconds: int = 3600
    usage_poll_interval_seconds: int = 900

    # Audit log — blob storage
    storage_provider: StorageProvider = StorageProvider.AZURE_BLOB
    audit_bucket: str = ""
    audit_prefix: str = "billing/v1"
    azure_storage_connection_string: str = ""

    # Databricks SQL API — for querying usage aggregation tables
    databricks_host: str = ""  # e.g. adb-1234567890.1.azuredatabricks.net
    databricks_token: str = ""  # personal access token
    databricks_warehouse_id: str = ""  # SQL warehouse ID

    # Notifications — Azure Email Communication Service
    azure_ecs_connection_string: str = ""
    azure_ecs_sender: str = "billing@clawtrace.ai"
    slack_webhook_url: str = ""
    notification_enabled: bool = True
