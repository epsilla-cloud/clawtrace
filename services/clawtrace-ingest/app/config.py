from __future__ import annotations

import json
from enum import Enum
from pathlib import Path
from typing import Dict

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class AuthMode(str, Enum):
    MOCK_PASS = "mock_pass"
    STATIC_KEYS = "static_keys"


class RawSink(str, Enum):
    LOCAL = "local"
    GCS = "gcs"


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

    raw_sink: RawSink = RawSink.LOCAL
    local_data_root: Path = Path("./data/raw")
    gcs_bucket: str = ""
    gcs_prefix: str = "raw-events"

    enable_idempotency: bool = True
    idempotency_db_path: Path = Path("./data/idempotency.sqlite3")

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
