from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from google.cloud import storage

from .models import PersistedEvent


class RawEventStorage:
    def write_event(self, event: PersistedEvent) -> str:
        raise NotImplementedError


class DataLakeRawEventStorage(RawEventStorage):
    def __init__(self, bucket_name: str, prefix: str):
        self._bucket_name = bucket_name
        self._prefix = prefix.strip("/")
        self._client: storage.Client | None = None

    def _get_client(self) -> storage.Client:
        if self._client is None:
            self._client = storage.Client()
        return self._client

    def write_event(self, event: PersistedEvent) -> str:
        dt = datetime.now(timezone.utc)
        blob_name = (
            f"{self._prefix}/dt={dt.strftime('%Y-%m-%d')}/hr={dt.strftime('%H')}/"
            f"agent={event.agentId}/event-{dt.strftime('%Y%m%dT%H%M%S')}-{uuid4().hex}.jsonl"
        )
        bucket = self._get_client().bucket(self._bucket_name)
        blob = bucket.blob(blob_name)
        payload = event.model_dump_json()
        blob.upload_from_string(payload + "\n", content_type="application/x-ndjson")
        return f"gs://{self._bucket_name}/{blob_name}"
