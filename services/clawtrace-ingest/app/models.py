from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class EventType(str, Enum):
    SESSION_START = "session_start"
    SESSION_END = "session_end"
    SPAN_START = "span_start"
    SPAN_END = "span_end"
    LLM_BEFORE_CALL = "llm_before_call"
    LLM_AFTER_CALL = "llm_after_call"
    TOOL_BEFORE_CALL = "tool_before_call"
    TOOL_AFTER_CALL = "tool_after_call"
    SUBAGENT_SPAWN = "subagent_spawn"
    SUBAGENT_JOIN = "subagent_join"
    ERROR = "error"


class HookEvent(BaseModel):
    model_config = ConfigDict(extra="allow")

    eventId: str = Field(min_length=1)
    eventType: EventType
    traceId: str = Field(min_length=1)
    spanId: str = Field(min_length=1)
    parentSpanId: Optional[str] = None
    tsMs: int = Field(ge=0)
    payload: Dict[str, Any] = Field(default_factory=dict)


class IngestEventRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    schemaVersion: int = Field(ge=1)
    agentId: UUID
    event: HookEvent


class IngestEventResponse(BaseModel):
    status: str
    duplicate: bool
    schemaVersion: int
    agentId: UUID
    traceId: str
    spanId: str
    eventId: str
    eventType: EventType
    receivedAt: datetime
    rawObjectPath: Optional[str] = None


class AuthContext(BaseModel):
    accountId: str
    apiKeyId: str


class PersistedEvent(BaseModel):
    schemaVersion: int
    accountId: str
    apiKeyId: str
    agentId: UUID
    receivedAt: datetime
    event: HookEvent

    @classmethod
    def from_request(
        cls,
        request: IngestEventRequest,
        auth: AuthContext,
        *,
        account_id_override: str | None = None,
    ) -> "PersistedEvent":
        return cls(
            schemaVersion=request.schemaVersion,
            accountId=account_id_override or auth.accountId,
            apiKeyId=auth.apiKeyId,
            agentId=request.agentId,
            receivedAt=datetime.now(timezone.utc),
            event=request.event,
        )
