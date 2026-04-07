"""Lightweight asyncio-based periodic scheduler."""

from __future__ import annotations

import asyncio
import logging
from typing import Awaitable, Callable

logger = logging.getLogger(__name__)


class Scheduler:
    """Register async coroutine factories to run at fixed intervals."""

    def __init__(self) -> None:
        self._tasks: list[asyncio.Task[None]] = []

    def register(
        self,
        name: str,
        coro_factory: Callable[[], Awaitable[None]],
        interval_seconds: int,
    ) -> None:
        async def _loop() -> None:
            # Small initial delay to let the app finish startup
            await asyncio.sleep(2)
            while True:
                try:
                    await coro_factory()
                except asyncio.CancelledError:
                    break
                except Exception:
                    logger.exception("Scheduler job '%s' failed", name)
                await asyncio.sleep(interval_seconds)

        task = asyncio.create_task(_loop(), name=f"scheduler:{name}")
        self._tasks.append(task)
        logger.info(
            "Registered scheduler job '%s' every %ds", name, interval_seconds
        )

    async def shutdown(self) -> None:
        for task in self._tasks:
            task.cancel()
        await asyncio.gather(*self._tasks, return_exceptions=True)
        logger.info("Scheduler shut down (%d jobs cancelled)", len(self._tasks))
