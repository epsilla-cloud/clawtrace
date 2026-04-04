from __future__ import annotations

import json
from enum import Enum
from typing import Dict

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class AuthMode(str, Enum):
    MOCK_PASS = "mock_pass"
    STATIC_KEYS = "static_keys"
    REMOTE_API = "remote_api"


class StorageProvider(str, Enum):
    GCS = "gcs"
    AZURE_BLOB = "azure_blob"
    AWS_S3 = "aws_s3"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="CLAWTRACE_INGEST_",
        extra="ignore",
    )

    app_name: str = "clawtrace-ingest"
    host: str = "0.0.0.0"
    port: int = 8080
    log_level: str = "INFO"

    auth_mode: AuthMode = AuthMode.MOCK_PASS
    static_keys_json: str = "{}"
    # remote_api mode: validate observe keys against the clawtrace-backend
    backend_url: str = "https://api.clawtrace.ai"
    internal_secret: str = ""

    storage_provider: StorageProvider = StorageProvider.GCS
    raw_bucket: str = ""
    raw_prefix: str = ""
    # Backward-compatible fallback; use raw_bucket/raw_prefix moving forward.
    gcs_bucket: str = "clawtrace-raw"
    gcs_prefix: str = "raw/v1"
    azure_container: str = ""
    azure_account_url: str = ""
    azure_connection_string: str = ""
    aws_region: str = ""
    aws_endpoint_url: str = ""

    pubsub_topic: str = ""

    schema_version: int = Field(default=1)

    @property
    def static_keys(self) -> Dict[str, str]:
        try:
            data = json.loads(self.static_keys_json or "{}")
        except json.JSONDecodeError as exc:
            raise ValueError("CLAWTRACE_INGEST_STATIC_KEYS_JSON is invalid JSON") from exc
        if not isinstance(data, dict):
            raise ValueError("CLAWTRACE_INGEST_STATIC_KEYS_JSON must be a JSON object")
        return {str(k): str(v) for k, v in data.items()}

    @property
    def object_bucket(self) -> str:
        return (self.raw_bucket or "").strip() or (self.gcs_bucket or "").strip()

    @property
    def object_prefix(self) -> str:
        return (self.raw_prefix or "").strip() or (self.gcs_prefix or "").strip()
