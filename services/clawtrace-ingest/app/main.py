from __future__ import annotations

from fastapi import FastAPI, Header, HTTPException, status

from .auth import authenticate
from .config import RawSink, Settings
from .idempotency import IdempotencyStore
from .models import IngestEventRequest, PersistedEvent
from .publisher import NoopPublisher, PubSubEventPublisher
from .service import IngestService
from .storage import GcsRawEventStorage, LocalRawEventStorage


def create_ingest_service(settings: Settings) -> IngestService:
    if settings.raw_sink == RawSink.LOCAL:
        storage = LocalRawEventStorage(settings.local_data_root)
    elif settings.raw_sink == RawSink.GCS:
        storage = GcsRawEventStorage(settings.gcs_bucket, settings.gcs_prefix)
    else:
        raise ValueError(f"Unsupported raw sink: {settings.raw_sink}")

    publisher = PubSubEventPublisher(settings.pubsub_topic) if settings.pubsub_topic else NoopPublisher()

    idempotency = None
    if settings.enable_idempotency:
        idempotency = IdempotencyStore(settings.idempotency_db_path)

    return IngestService(
        storage=storage,
        publisher=publisher,
        idempotency=idempotency,
        schema_version=settings.schema_version,
    )


def create_app(settings: Settings | None = None) -> FastAPI:
    resolved_settings = settings or Settings()

    app = FastAPI(
        title="ClawTrace Ingest API",
        version="0.1.0",
        description="Ingests OpenClaw hook events into raw storage for Iceberg analytics.",
    )

    app.state.settings = resolved_settings
    app.state.ingest_service = create_ingest_service(resolved_settings)

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
