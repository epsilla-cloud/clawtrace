from __future__ import annotations

from datetime import datetime, timezone

from .models import IngestEventRequest, IngestEventResponse, PersistedEvent
from .publisher import EventPublisher
from .storage import RawEventStorage


class IngestService:
    def __init__(
        self,
        *,
        storage: RawEventStorage,
        publisher: EventPublisher,
        schema_version: int,
    ):
        self._storage = storage
        self._publisher = publisher
        self._schema_version = schema_version

    def ingest(self, request: IngestEventRequest, persisted_event: PersistedEvent) -> IngestEventResponse:
        if request.schemaVersion != self._schema_version:
            return IngestEventResponse(
                status="rejected_schema_version",
                duplicate=False,
                schemaVersion=request.schemaVersion,
                agentId=request.agentId,
                traceId=request.event.traceId,
                spanId=request.event.spanId,
                eventId=request.event.eventId,
                eventType=request.event.eventType,
                receivedAt=datetime.now(timezone.utc),
            )

        raw_object_path = self._storage.write_event(persisted_event)
        self._publisher.publish(persisted_event, raw_object_path)

        return IngestEventResponse(
            status="accepted",
            duplicate=False,
            schemaVersion=request.schemaVersion,
            agentId=request.agentId,
            traceId=request.event.traceId,
            spanId=request.event.spanId,
            eventId=request.event.eventId,
            eventType=request.event.eventType,
            receivedAt=persisted_event.receivedAt,
            rawObjectPath=raw_object_path,
        )
