from __future__ import annotations

from datetime import datetime, timezone
from typing import Protocol
from uuid import uuid4

from google.cloud import storage

from .config import Settings, StorageProvider
from .models import PersistedEvent


class RawEventStorage:
    def write_event(self, event: PersistedEvent) -> str:
        raise NotImplementedError


class ObjectStorageWriter(Protocol):
    def write_text(self, object_key: str, payload: str, *, content_type: str) -> str:
        ...


class GCSObjectStorageWriter:
    def __init__(self, bucket_name: str):
        self._bucket_name = bucket_name
        self._client: storage.Client | None = None

    def _get_client(self) -> storage.Client:
        if self._client is None:
            self._client = storage.Client()
        return self._client

    def write_text(self, object_key: str, payload: str, *, content_type: str) -> str:
        bucket = self._get_client().bucket(self._bucket_name)
        blob = bucket.blob(object_key)
        blob.upload_from_string(payload, content_type=content_type)
        return f"gs://{self._bucket_name}/{object_key}"


class DataLakeRawEventStorage(RawEventStorage):
    def __init__(self, writer: ObjectStorageWriter, prefix: str):
        self._writer = writer
        self._prefix = prefix.strip("/")

    def write_event(self, event: PersistedEvent) -> str:
        dt = datetime.now(timezone.utc)
        object_key = (
            f"{self._prefix}/dt={dt.strftime('%Y-%m-%d')}/hr={dt.strftime('%H')}/"
            f"agent={event.agentId}/event-{dt.strftime('%Y%m%dT%H%M%S')}-{uuid4().hex}.jsonl"
        )
        payload = event.model_dump_json()
        return self._writer.write_text(
            object_key,
            payload + "\n",
            content_type="application/x-ndjson",
        )


def create_raw_event_storage(settings: Settings) -> RawEventStorage:
    if settings.storage_provider == StorageProvider.GCS:
        writer = GCSObjectStorageWriter(settings.object_bucket)
        return DataLakeRawEventStorage(writer, settings.object_prefix)
    raise ValueError(
        f"Unsupported CLAWTRACE_INGEST_STORAGE_PROVIDER={settings.storage_provider!s}. "
        "Supported providers: gcs"
    )
