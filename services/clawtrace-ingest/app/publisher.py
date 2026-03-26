from __future__ import annotations

import json
from typing import Optional

from google.cloud import pubsub_v1

from .models import PersistedEvent


class EventPublisher:
    def publish(self, event: PersistedEvent, raw_object_path: str) -> Optional[str]:
        raise NotImplementedError


class NoopPublisher(EventPublisher):
    def publish(self, event: PersistedEvent, raw_object_path: str) -> Optional[str]:
        return None


class PubSubEventPublisher(EventPublisher):
    def __init__(self, topic: str):
        self._topic = topic
        self._client = pubsub_v1.PublisherClient()

    def publish(self, event: PersistedEvent, raw_object_path: str) -> Optional[str]:
        body = {
            "schemaVersion": event.schemaVersion,
            "accountId": event.accountId,
            "agentId": str(event.agentId),
            "traceId": event.event.traceId,
            "spanId": event.event.spanId,
            "eventId": event.event.eventId,
            "eventType": event.event.eventType,
            "rawObjectPath": raw_object_path,
            "receivedAt": event.receivedAt.isoformat(),
        }
        result = self._client.publish(self._topic, json.dumps(body).encode("utf-8"))
        return result.result(timeout=10)
