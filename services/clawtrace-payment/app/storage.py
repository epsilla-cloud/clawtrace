"""Audit log writer — blob storage for credit transactions."""

from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from uuid import uuid4

from .config import Settings, StorageProvider

logger = logging.getLogger(__name__)


class AuditWriter:
    """Writes credit transaction audit logs to blob storage.

    Mirrors the ingest service's sidecar bucket pattern:
    {prefix}/tenant={user_id}/dt=YYYY-MM-DD/hr=HH/credit-txn-{uuid}.json
    """

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._client: object | None = None

    def _ensure_client(self):
        if self._client is not None:
            return
        s = self._settings
        if s.storage_provider == StorageProvider.AZURE_BLOB:
            from azure.storage.blob import BlobServiceClient

            self._client = BlobServiceClient.from_connection_string(
                s.azure_storage_connection_string
            )
        else:
            logger.warning(
                "Audit storage provider %s not yet implemented, logs will be skipped",
                s.storage_provider,
            )

    async def write_transaction(
        self,
        user_id: str,
        amount: float,
        balance_after: float,
        txn_type: str,
        description: dict | None = None,
        reference_id: str | None = None,
        cost_breakdown: dict | None = None,
    ) -> None:
        now = datetime.now(timezone.utc)
        record = {
            "id": str(uuid4()),
            "user_id": user_id,
            "amount": amount,
            "balance_after": balance_after,
            "type": txn_type,
            "description": description,
            "reference_id": reference_id,
            "cost_breakdown": cost_breakdown,
            "created_at": now.isoformat(),
        }
        blob_path = (
            f"{self._settings.audit_prefix}"
            f"/tenant={user_id}"
            f"/dt={now.strftime('%Y-%m-%d')}"
            f"/hr={now.strftime('%H')}"
            f"/credit-txn-{record['id']}.json"
        )
        payload = json.dumps(record).encode("utf-8")

        try:
            self._ensure_client()
            if self._client is None:
                return

            if self._settings.storage_provider == StorageProvider.AZURE_BLOB:
                container = self._client.get_container_client(  # type: ignore[union-attr]
                    self._settings.audit_bucket
                )
                container.upload_blob(blob_path, payload, overwrite=True)

            logger.debug("Audit log written: %s", blob_path)
        except Exception:
            logger.exception("Failed to write audit log to %s", blob_path)
