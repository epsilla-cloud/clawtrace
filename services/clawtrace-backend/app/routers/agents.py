from __future__ import annotations

import asyncio
import logging

from fastapi import APIRouter, Depends, HTTPException, status

from ..auth import get_current_user, get_settings
from ..cascade_delete import cascade_delete_agent_data
from ..config import Settings
from ..database import delete_agent, list_agents, rename_agent
from ..models import AgentItem, AgentListResponse, RenameAgentRequest, UserSession

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/v1/agents", tags=["agents"])


@router.get("", response_model=AgentListResponse)
async def get_agents(
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
) -> AgentListResponse:
    """List all active agents (non-revoked observe keys) for the authenticated tenant."""
    agents = await list_agents(session.db_id, settings)
    return AgentListResponse(agents=agents)


@router.patch("/{agent_id}", response_model=AgentItem)
async def rename_agent_endpoint(
    agent_id: str,
    body: RenameAgentRequest,
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
) -> AgentItem:
    """Rename an agent. Returns 404 if the agent does not exist or belongs to another tenant."""
    updated = await rename_agent(agent_id, session.db_id, body.name, settings)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="agent not found",
        )
    # Re-fetch the updated agent to return it.
    agents = await list_agents(session.db_id, settings)
    for agent in agents:
        if str(agent.id) == agent_id:
            return agent
    # Extremely unlikely — just renamed successfully but missing from list.
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="agent not found after rename",
    )


@router.delete("/{agent_id}", status_code=204)
async def delete_agent_endpoint(
    agent_id: str,
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
) -> None:
    """Permanently delete an agent, its observe key, and all associated trace data.
    Cascade deletes raw blobs from Azure Storage and rows from Databricks silver tables.
    """
    deleted = await delete_agent(agent_id, session.db_id, settings)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="agent not found",
        )
    # Cascade delete trace data in the background (don't block the API response)
    asyncio.create_task(
        cascade_delete_agent_data(session.db_id, agent_id, settings)
    )
