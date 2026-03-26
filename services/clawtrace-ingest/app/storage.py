from __future__ import annotations

import json
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from google.cloud import storage

from .models import PersistedEvent


class RawEventStorage(ABC):
    @abstractmethod
    def write_event(self, event: PersistedEvent) -> str:
        raise NotImplementedError


class LocalRawEventStorage(RawEventStorage):
    def __init__(self, root: Path):
        self._root = root

    def write_event(self, event: PersistedEvent) -> str:
        dt = datetime.now(timezone.utc)
        dir_path = (
            self._root
            / f"dt={dt.strftime('%Y-%m-%d')}"
            / f"hr={dt.strftime('%H')}"
            / f"agent={event.agentId}"
        )
        dir_path.mkdir(parents=True, exist_ok=True)
        filename = f"event-{dt.strftime('%Y%m%dT%H%M%S')}-{uuid4().hex}.jsonl"
        file_path = dir_path / filename
        payload = event.model_dump(mode="json")
        with file_path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(payload, ensure_ascii=False) + "\n")
        return str(file_path)


class GcsRawEventStorage(RawEventStorage):
    def __init__(self, bucket_name: str, prefix: str):
        if not bucket_name:
            raise ValueError("gcs_bucket is required when raw sink is gcs")
        self._bucket_name = bucket_name
        self._prefix = prefix.strip("/")
        self._client = storage.Client()

    def write_event(self, event: PersistedEvent) -> str:
        dt = datetime.now(timezone.utc)
        blob_name = (
            f"{self._prefix}/dt={dt.strftime('%Y-%m-%d')}/hr={dt.strftime('%H')}/"
            f"agent={event.agentId}/event-{dt.strftime('%Y%m%dT%H%M%S')}-{uuid4().hex}.jsonl"
        )
        bucket = self._client.bucket(self._bucket_name)
        blob = bucket.blob(blob_name)
        payload = event.model_dump_json()
        blob.upload_from_string(payload + "\n", content_type="application/x-ndjson")
        return f"gs://{self._bucket_name}/{blob_name}"
