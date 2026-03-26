from __future__ import annotations

import pytest

import app.storage as storage_module
from app.config import Settings, StorageProvider


class _NoopWriter:
    def write_text(self, object_key: str, payload: str, *, content_type: str) -> str:
        return f"noop://{object_key}"


def test_create_storage_factory_selects_gcs(monkeypatch: pytest.MonkeyPatch):
    captured: dict[str, str] = {}

    class _DummyGcsWriter(_NoopWriter):
        def __init__(self, bucket_name: str):
            captured["bucket"] = bucket_name

    monkeypatch.setattr(storage_module, "GCSObjectStorageWriter", _DummyGcsWriter)

    settings = Settings(
        storage_provider=StorageProvider.GCS,
        raw_bucket="gcs-raw",
        raw_prefix="raw/v1",
    )

    storage = storage_module.create_raw_event_storage(settings)
    assert isinstance(storage, storage_module.DataLakeRawEventStorage)
    assert captured["bucket"] == "gcs-raw"


def test_create_storage_factory_selects_azure(monkeypatch: pytest.MonkeyPatch):
    captured: dict[str, str] = {}

    class _DummyAzureWriter(_NoopWriter):
        def __init__(self, *, container_name: str, account_url: str = "", connection_string: str = ""):
            captured["container"] = container_name
            captured["account_url"] = account_url
            captured["connection_string"] = connection_string

    monkeypatch.setattr(storage_module, "AzureBlobObjectStorageWriter", _DummyAzureWriter)

    settings = Settings(
        storage_provider=StorageProvider.AZURE_BLOB,
        azure_container="trace-raw",
        azure_account_url="https://acct.blob.core.windows.net",
        raw_prefix="raw/v1",
    )

    storage = storage_module.create_raw_event_storage(settings)
    assert isinstance(storage, storage_module.DataLakeRawEventStorage)
    assert captured["container"] == "trace-raw"
    assert captured["account_url"] == "https://acct.blob.core.windows.net"


def test_create_storage_factory_selects_aws(monkeypatch: pytest.MonkeyPatch):
    captured: dict[str, str] = {}

    class _DummyS3Writer(_NoopWriter):
        def __init__(self, *, bucket_name: str, region: str = "", endpoint_url: str = ""):
            captured["bucket"] = bucket_name
            captured["region"] = region
            captured["endpoint"] = endpoint_url

    monkeypatch.setattr(storage_module, "S3ObjectStorageWriter", _DummyS3Writer)

    settings = Settings(
        storage_provider=StorageProvider.AWS_S3,
        raw_bucket="trace-raw",
        raw_prefix="raw/v1",
        aws_region="us-east-1",
        aws_endpoint_url="",
    )

    storage = storage_module.create_raw_event_storage(settings)
    assert isinstance(storage, storage_module.DataLakeRawEventStorage)
    assert captured["bucket"] == "trace-raw"
    assert captured["region"] == "us-east-1"


def test_create_storage_factory_rejects_missing_bucket_for_gcs():
    settings = Settings(
        storage_provider=StorageProvider.GCS,
        raw_bucket="",
        gcs_bucket="",
        raw_prefix="raw/v1",
    )

    with pytest.raises(ValueError, match="CLAWTRACE_INGEST_RAW_BUCKET"):
        storage_module.create_raw_event_storage(settings)


def test_create_storage_factory_rejects_missing_container_for_azure():
    settings = Settings(
        storage_provider=StorageProvider.AZURE_BLOB,
        azure_container="",
        raw_bucket="",
        gcs_bucket="",
        raw_prefix="raw/v1",
    )

    with pytest.raises(ValueError, match="CLAWTRACE_INGEST_AZURE_CONTAINER"):
        storage_module.create_raw_event_storage(settings)
