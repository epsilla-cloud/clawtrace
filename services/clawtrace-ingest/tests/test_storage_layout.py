from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

from app.models import EventType, HookEvent, PersistedEvent
from app.storage import DataLakeRawEventStorage


class _CaptureWriter:
    def __init__(self):
        self.object_key: str | None = None
        self.payload: str | None = None
        self.content_type: str | None = None

    def write_text(self, object_key: str, payload: str, *, content_type: str) -> str:
        self.object_key = object_key
        self.payload = payload
        self.content_type = content_type
        return f"noop://{object_key}"


def test_raw_object_key_uses_tenant_agent_partitions():
    writer = _CaptureWriter()
    storage = DataLakeRawEventStorage(writer, "raw/v1")
    event = PersistedEvent(
        schemaVersion=1,
        accountId="acct-prod-1",
        apiKeyId="ct_live_abcd",
        agentId=UUID("8f8c8e1d-6a2f-4a7f-b1bd-0e4e6f8a2f19"),
        receivedAt=datetime(2026, 3, 26, 6, 0, 0, tzinfo=timezone.utc),
        event=HookEvent(
            eventId="e5f2d4b4-9b2d-4c0f-9f06-73f6ea9d90cf",
            eventType=EventType.SPAN_START,
            traceId="trace-abc",
            spanId="span-001",
            parentSpanId=None,
            tsMs=1764064800000,  # 2025-11-25T10:00:00Z
            payload={"name": "main-session"},
        ),
    )

    raw_object_path = storage.write_event(event)

    assert (
        writer.object_key
        == "raw/v1/tenant=acct-prod-1/agent=8f8c8e1d-6a2f-4a7f-b1bd-0e4e6f8a2f19/"
        "dt=2025-11-25/hr=10/event-e5f2d4b4-9b2d-4c0f-9f06-73f6ea9d90cf.json"
    )
    assert writer.content_type == "application/json"
    assert writer.payload == event.model_dump_json()
    assert raw_object_path.endswith(writer.object_key or "")


def test_raw_object_key_defaults_prefix_to_raw_v1():
    writer = _CaptureWriter()
    storage = DataLakeRawEventStorage(writer, "")
    event = PersistedEvent(
        schemaVersion=1,
        accountId="REDACTED_ACCOUNT",
        apiKeyId="REDACTED_KEY",
        agentId=UUID("11111111-1111-1111-1111-111111111111"),
        receivedAt=datetime(2026, 3, 26, 6, 0, 0, tzinfo=timezone.utc),
        event=HookEvent(
            eventId="evt-1",
            eventType=EventType.SPAN_START,
            traceId="trace-1",
            spanId="span-1",
            parentSpanId=None,
            tsMs=1764064800000,
            payload={},
        ),
    )

    storage.write_event(event)

    assert writer.object_key is not None
    assert writer.object_key.startswith("raw/v1/tenant=REDACTED_ACCOUNT/agent=11111111-1111-1111-1111-111111111111/")
