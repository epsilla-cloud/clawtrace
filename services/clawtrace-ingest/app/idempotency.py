from __future__ import annotations

import sqlite3
import threading
from pathlib import Path


class IdempotencyStore:
    def __init__(self, db_path: Path):
        self._db_path = db_path
        self._lock = threading.Lock()
        self._db_path.parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(str(db_path), check_same_thread=False)
        self._conn.execute(
            """
            CREATE TABLE IF NOT EXISTS ingested_events (
              agent_id TEXT NOT NULL,
              event_id TEXT NOT NULL,
              trace_id TEXT NOT NULL,
              span_id TEXT NOT NULL,
              event_type TEXT NOT NULL,
              received_at_ms INTEGER NOT NULL,
              PRIMARY KEY (agent_id, event_id)
            )
            """
        )
        self._conn.commit()

    def try_insert(
        self,
        *,
        agent_id: str,
        event_id: str,
        trace_id: str,
        span_id: str,
        event_type: str,
        received_at_ms: int,
    ) -> bool:
        with self._lock:
            cursor = self._conn.execute(
                """
                INSERT OR IGNORE INTO ingested_events
                (agent_id, event_id, trace_id, span_id, event_type, received_at_ms)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (agent_id, event_id, trace_id, span_id, event_type, received_at_ms),
            )
            self._conn.commit()
            return cursor.rowcount == 1
