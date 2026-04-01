from __future__ import annotations

from fastapi import APIRouter, Depends

from ..auth import get_current_user
from ..models import UserSession

router = APIRouter(prefix="/v1/auth", tags=["auth"])


@router.get("/me", response_model=UserSession)
async def get_me(session: UserSession = Depends(get_current_user)) -> UserSession:
    """Return the current authenticated user's session.
    The db_id field is the tenant_id in the ClawTrace silver layer.
    """
    return session
