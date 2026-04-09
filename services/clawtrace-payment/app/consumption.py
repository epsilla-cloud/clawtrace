"""Thread-safe in-memory consumption map."""

from __future__ import annotations

import threading
from collections import defaultdict


class ConsumptionStore:
    """Accumulates per-tenant consumption in memory.

    Key:   tenant_id (str)
    Value: dict[str, float]  — line_item -> accumulated amount

    ``accept()`` merges new items (adds to existing keys).
    ``harvest_all()`` atomically snapshots and resets the entire map
    so the harvester can process without double-charging.
    """

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._data: dict[str, dict[str, float]] = defaultdict(
            lambda: defaultdict(float)
        )

    def accept(self, tenant_id: str, items: dict[str, float]) -> None:
        with self._lock:
            tenant_map = self._data[tenant_id]
            for key, value in items.items():
                tenant_map[key] += value

    def harvest_all(self) -> dict[str, dict[str, float]]:
        with self._lock:
            snapshot = {k: dict(v) for k, v in self._data.items()}
            self._data = defaultdict(lambda: defaultdict(float))
        return snapshot

    def peek(self, tenant_id: str) -> dict[str, float]:
        """Read-only snapshot for a single tenant (for debugging)."""
        with self._lock:
            return dict(self._data.get(tenant_id, {}))
