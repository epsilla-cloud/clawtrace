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
    referral_new_user_credits: float = 200.0
    referral_referrer_credits: float = 200.0
    credit_expiration_days: int = 730
    credits_per_dollar: float = 100.0
    low_credit_threshold: float = 50.0

    # Pricing table: line_item -> credits per unit (JSON string)
    pricing_table_json: str = (
        '{"llm_input_token_1k": 0.5, "llm_output_token_1k": 1.5,'
        ' "tool_call": 0.1, "storage_gb_hour": 2.0}'
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

    # Notifications — Azure Email Communication Service
    azure_ecs_connection_string: str = ""
    azure_ecs_sender: str = "billing@clawtrace.ai"
    slack_webhook_url: str = ""
    notification_enabled: bool = True
