from __future__ import annotations

from fastapi import FastAPI, Header, HTTPException, status

from .auth import authenticate
from .config import Settings
from .models import IngestEventRequest, PersistedEvent
from .publisher import NoopPublisher, PubSubEventPublisher
from .service import IngestService
from .storage import create_raw_event_storage


def create_ingest_service(settings: Settings) -> IngestService:
    if not settings.object_bucket:
        raise ValueError("CLAWTRACE_INGEST_RAW_BUCKET must be set for data-lake ingestion.")
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

    @app.get("/healthz")
    def healthz() -> dict[str, str]:
        return {"status": "ok"}

    @app.post("/v1/traces/events")
    def ingest_event(
        body: IngestEventRequest,
        authorization: str | None = Header(default=None, alias="Authorization"),
    ):
        auth_context = authenticate(app.state.settings, authorization)
        persisted = PersistedEvent.from_request(body, auth_context)
        response = app.state.ingest_service.ingest(body, persisted)
        if response.status == "rejected_schema_version":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail={
                    "error": "schema_version_mismatch",
                    "expected": app.state.settings.schema_version,
                    "received": body.schemaVersion,
                },
            )
        return response.model_dump(mode="json")

    return app


app = create_app()
