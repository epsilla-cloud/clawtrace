"""Poll external usage data (trace storage) and feed into consumption store.

Runs periodically (default every 15 min). Measures each tenant's raw trace
storage in Azure Blob and reports it as consumption for credit deduction.

Storage pricing: credits per MB per day, prorated to the poll interval.
"""

from __future__ import annotations

import logging

from .config import Settings, StorageProvider
from .consumption import ConsumptionStore

logger = logging.getLogger(__name__)


async def poll_storage_usage(store: ConsumptionStore, settings: Settings) -> None:
    """Measure per-tenant storage and feed into consumption store."""
    if not settings.azure_storage_connection_string:
        return

    try:
        from azure.storage.blob import BlobServiceClient

        # Determine how many poll intervals per day
        intervals_per_day = max(1, 86400 / settings.usage_poll_interval_seconds)

        client = BlobServiceClient.from_connection_string(
            settings.azure_storage_connection_string
        )
        # Scan the raw trace container
        container_name = "clawtrace-raw"
        container = client.get_container_client(container_name)

        tenant_sizes: dict[str, int] = {}
        for blob in container.list_blobs():
            parts = blob.name.split("/")
            tenant = next(
                (p.split("=")[1] for p in parts if p.startswith("tenant=")),
                None,
            )
            if tenant:
                tenant_sizes[tenant] = tenant_sizes.get(tenant, 0) + (blob.size or 0)

        if not tenant_sizes:
            return

        for tenant_id, size_bytes in tenant_sizes.items():
            size_mb = size_bytes / (1024 * 1024)
            # Prorate: storage_mb_day / intervals_per_day
            prorated_mb = size_mb / intervals_per_day
            if prorated_mb > 0.0001:
                store.accept(tenant_id, {"storage_mb_day": prorated_mb})

        logger.info(
            "Storage poll: %d tenants, %.1f MB total, prorated 1/%d of daily",
            len(tenant_sizes),
            sum(tenant_sizes.values()) / (1024 * 1024),
            intervals_per_day,
        )

    except Exception:
        logger.exception("Failed to poll storage usage")
