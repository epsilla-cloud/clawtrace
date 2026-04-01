from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from ..auth import get_current_user, get_settings
from ..config import Settings
from ..database import get_tenant_info
from ..models import TenantInfo, UserSession

router = APIRouter(prefix="/v1/tenant", tags=["tenant"])


@router.get("/me", response_model=TenantInfo)
async def get_my_tenant(
    session: UserSession = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
) -> TenantInfo:
    """Return tenant info for the authenticated user.
    tenant_id = user UUID = the partition key in all silver tables.
    Use this to scope PuppyGraph queries: WHERE elementId(ten) = 'Tenant[<tenant_id>]'
    """
    tenant = await get_tenant_info(session.db_id, settings)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="tenant not found",
        )
    return tenant
