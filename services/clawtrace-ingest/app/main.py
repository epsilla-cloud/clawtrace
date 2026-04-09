from __future__ import annotations

from uuid import UUID

from fastapi import FastAPI, Header, HTTPException, status

from .auth import authenticate
from .config import AuthMode, Settings
from .deficit_guard import DeficitGuard
from .models import IngestEventRequest, PersistedEvent
from .publisher import NoopPublisher, PubSubEventPublisher
from .service import IngestService
from .storage import create_raw_event_storage


def create_ingest_service(settings: Settings) -> IngestService:
    storage = create_raw_event_storage(settings)
    publisher = PubSubEventPublisher(settings.pubsub_topic) if settings.pubsub_topic else NoopPublisher()

    return IngestService(
        storage=storage,
        publisher=publisher,
        schema_version=settings.schema_version,
    )


def create_app(
    settings: Settings | None = None,
    ingest_service: IngestService | None = None,
) -> FastAPI:
    resolved_settings = settings or Settings()

    app = FastAPI(
        title="ClawTrace Ingest API",
        version="0.1.0",
        description="Ingests OpenClaw hook events into data-lake raw storage for Iceberg analytics.",
    )

    app.state.settings = resolved_settings
    app.state.ingest_service = ingest_service or create_ingest_service(resolved_settings)
    app.state.deficit_guard = DeficitGuard(
        payment_url=resolved_settings.payment_url,
        internal_secret=resolved_settings.internal_secret,
        check_interval_s=resolved_settings.deficit_check_interval_seconds,
    )

    def resolve_account_id(settings: Settings, auth_account_id: str, tenant_id_header: str | None) -> str:
        if not tenant_id_header:
            return auth_account_id

        try:
            tenant_uuid = UUID(tenant_id_header)
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail={
                    "error": "invalid_tenant_id",
                    "message": "x-clawtrace-tenant-id must be a valid UUID.",
                },
            ) from exc

        tenant_id = str(tenant_uuid)

        # During early static-key rollout, stored account IDs might be placeholders
        # (for example "tenant_demo"). Prefer explicit tenant header in those cases.
        # If account ID is already UUID-shaped and disagrees, reject.
        if settings.auth_mode == AuthMode.STATIC_KEYS:
            try:
                auth_uuid = str(UUID(auth_account_id))
            except ValueError:
                return tenant_id
            if auth_uuid != tenant_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Tenant mismatch for API key.",
                )

        return tenant_id

    @app.get("/healthz")
    def healthz() -> dict[str, str]:
        return {"status": "ok"}

    @app.post("/v1/traces/events")
    async def ingest_event(
        body: IngestEventRequest,
        authorization: str | None = Header(default=None, alias="Authorization"),
        tenant_id_header: str | None = Header(default=None, alias="x-clawtrace-tenant-id"),
    ):
        auth_context = authenticate(app.state.settings, authorization)
        account_id = resolve_account_id(app.state.settings, auth_context.accountId, tenant_id_header)

        # Deficit guard: deny ingestion if tenant credits are exhausted
        await app.state.deficit_guard.check(account_id)

        persisted = PersistedEvent.from_request(
            body,
            auth_context,
            account_id_override=account_id,
        )
        response = app.state.ingest_service.ingest(body, persisted)
        if response.status == "rejected_schema_version":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail={
                    "error": "schema_version_mismatch",
                    "expected": app.state.settings.schema_version,
                    "received": body.schemaVersion,
                },
            )
        return response.model_dump(mode="json")

    return app


app = create_app()
