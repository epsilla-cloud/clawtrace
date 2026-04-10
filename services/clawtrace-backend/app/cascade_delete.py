"""Cascade deletion of agent trace data from raw storage and silver tables."""

from __future__ import annotations

import logging

import httpx

from .config import Settings

logger = logging.getLogger(__name__)


async def delete_raw_blobs(tenant_id: str, agent_id: str, settings: Settings) -> int:
    """Delete raw JSON event files from Azure Blob Storage for a specific agent.
    Returns the number of blobs deleted."""
    if not settings.azure_storage_connection_string:
        logger.warning("Azure storage not configured, skipping raw blob deletion")
        return 0

    try:
        from azure.storage.blob import ContainerClient

        container = ContainerClient.from_connection_string(
            settings.azure_storage_connection_string,
            container_name=settings.azure_storage_container,
        )
        prefix = f"raw/v1/tenant={tenant_id}/agent={agent_id}/"
        count = 0
        for blob in container.list_blobs(name_starts_with=prefix):
            container.delete_blob(blob.name)
            count += 1

        logger.info("Deleted %d raw blobs for agent %s (tenant %s)", count, agent_id, tenant_id)
        return count
    except Exception:
        logger.exception("Failed to delete raw blobs for agent %s", agent_id)
        return 0


async def delete_silver_tables(tenant_id: str, agent_id: str, settings: Settings) -> bool:
    """Delete rows from Databricks silver tables for a specific agent.
    Uses the SQL Statement API."""
    if not settings.databricks_host or not settings.databricks_token:
        logger.warning("Databricks not configured, skipping silver table deletion")
        return False

    url = f"https://{settings.databricks_host}/api/2.0/sql/statements/"
    headers = {
        "Authorization": f"Bearer {settings.databricks_token}",
        "Content-Type": "application/json",
    }
    base_body = {
        "warehouse_id": settings.databricks_warehouse_id,
        "wait_timeout": "30s",
    }

    tables = [
        ("clawtrace.silver.pg_child_of_edges", "agent_id"),
        ("clawtrace.silver.pg_spans", "agent_id"),
        ("clawtrace.silver.pg_traces", "agent_id"),
        ("clawtrace.silver.pg_agents", "agent_id"),
        ("clawtrace.silver.events_all", "agent_id"),
    ]

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            for table, col in tables:
                sql = f"DELETE FROM {table} WHERE tenant_id = '{tenant_id}' AND {col} = '{agent_id}'"
                resp = await client.post(url, json={**base_body, "statement": sql}, headers=headers)
                if resp.status_code == 200:
                    logger.info("Deleted from %s for agent %s", table, agent_id)
                else:
                    logger.warning("Failed to delete from %s: %s", table, resp.text[:200])

        return True
    except Exception:
        logger.exception("Failed to delete silver tables for agent %s", agent_id)
        return False


async def cascade_delete_agent_data(
    tenant_id: str, agent_id: str, settings: Settings
) -> dict:
    """Delete all trace data for an agent across raw storage and silver tables.
    Called after the api_key row is deleted from Neon."""
    results = {
        "raw_blobs_deleted": 0,
        "silver_tables_cleaned": False,
    }

    results["raw_blobs_deleted"] = await delete_raw_blobs(tenant_id, agent_id, settings)
    results["silver_tables_cleaned"] = await delete_silver_tables(tenant_id, agent_id, settings)

    logger.info(
        "Cascade delete complete for agent %s: blobs=%d, silver=%s",
        agent_id, results["raw_blobs_deleted"], results["silver_tables_cleaned"],
    )
    return results
