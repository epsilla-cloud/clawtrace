from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="CLAWTRACE_BACKEND_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # JWT — must match the JWT_SECRET used by the clawtrace-ui
    jwt_secret: str = "REDACTED"
    jwt_algorithm: str = "HS256"
    jwt_cookie_name: str = "auth_token"

    # Neon PostgreSQL (same DB as clawtrace-ui)
    database_url: str = ""

    # Server
    host: str = "0.0.0.0"
    port: int = 8082

    # API key format prefix
    api_key_prefix: str = "ct_live"

    # Internal shared secret for ingest service → backend validation calls
    internal_secret: str = "REDACTED"
