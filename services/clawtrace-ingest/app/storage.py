from __future__ import annotations

from datetime import datetime, timezone
from typing import Protocol
from uuid import uuid4

import boto3
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, ContentSettings
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


class AzureBlobObjectStorageWriter:
    def __init__(
        self,
        *,
        container_name: str,
        account_url: str = "",
        connection_string: str = "",
    ):
        self._container_name = container_name
        self._account_url = account_url
        self._connection_string = connection_string
        self._container_client = self._create_container_client()

    def _create_container_client(self):
        if self._connection_string:
            service_client = BlobServiceClient.from_connection_string(self._connection_string)
        else:
            if not self._account_url:
                raise ValueError(
                    "CLAWTRACE_INGEST_AZURE_ACCOUNT_URL must be set when "
                    "CLAWTRACE_INGEST_AZURE_CONNECTION_STRING is empty."
                )
            service_client = BlobServiceClient(
                account_url=self._account_url,
                credential=DefaultAzureCredential(),
            )
        return service_client.get_container_client(self._container_name)

    def write_text(self, object_key: str, payload: str, *, content_type: str) -> str:
        blob_client = self._container_client.get_blob_client(object_key)
        blob_client.upload_blob(
            payload.encode("utf-8"),
            overwrite=True,
            content_settings=ContentSettings(content_type=content_type),
        )
        return f"{self._container_client.url}/{object_key}"


class S3ObjectStorageWriter:
    def __init__(
        self,
        *,
        bucket_name: str,
        region: str = "",
        endpoint_url: str = "",
    ):
        self._bucket_name = bucket_name
        self._client = boto3.client(
            "s3",
            region_name=region or None,
            endpoint_url=endpoint_url or None,
        )

    def write_text(self, object_key: str, payload: str, *, content_type: str) -> str:
        self._client.put_object(
            Bucket=self._bucket_name,
            Key=object_key,
            Body=payload.encode("utf-8"),
            ContentType=content_type,
        )
        return f"s3://{self._bucket_name}/{object_key}"


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
        if not settings.object_bucket:
            raise ValueError("Set CLAWTRACE_INGEST_RAW_BUCKET for gcs storage.")
        writer = GCSObjectStorageWriter(settings.object_bucket)
        return DataLakeRawEventStorage(writer, settings.object_prefix)
    if settings.storage_provider == StorageProvider.AZURE_BLOB:
        container = (settings.azure_container or "").strip() or settings.object_bucket
        if not container:
            raise ValueError("Set CLAWTRACE_INGEST_AZURE_CONTAINER or CLAWTRACE_INGEST_RAW_BUCKET.")
        writer = AzureBlobObjectStorageWriter(
            container_name=container,
            account_url=(settings.azure_account_url or "").strip(),
            connection_string=(settings.azure_connection_string or "").strip(),
        )
        return DataLakeRawEventStorage(writer, settings.object_prefix)
    if settings.storage_provider == StorageProvider.AWS_S3:
        if not settings.object_bucket:
            raise ValueError("Set CLAWTRACE_INGEST_RAW_BUCKET for aws_s3 storage.")
        writer = S3ObjectStorageWriter(
            bucket_name=settings.object_bucket,
            region=(settings.aws_region or "").strip(),
            endpoint_url=(settings.aws_endpoint_url or "").strip(),
        )
        return DataLakeRawEventStorage(writer, settings.object_prefix)
    raise ValueError(
        f"Unsupported CLAWTRACE_INGEST_STORAGE_PROVIDER={settings.storage_provider!s}. "
        "Supported providers: gcs, azure_blob, aws_s3"
    )
