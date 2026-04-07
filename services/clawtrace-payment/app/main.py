"""ClawTrace Payment Service — consumption-based billing."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import Settings
from .consumption import ConsumptionStore
from .database import close_pool, run_migrations
from .harvester import run_harvest
from .notifications import send_pending_notifications
from .scheduler import Scheduler
from .storage import AuditWriter

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings: Settings = app.state.settings

    # 1. Database migrations
    if settings.database_url:
        await run_migrations(settings)

    # 2. In-memory consumption store + audit writer
    store = ConsumptionStore()
    audit_writer = AuditWriter(settings)
    app.state.store = store
    app.state.audit_writer = audit_writer

    # 3. Scheduler
    scheduler = Scheduler()
    scheduler.register(
        "harvest",
        lambda: run_harvest(store, audit_writer, settings),
        settings.harvest_interval_seconds,
    )
    scheduler.register(
        "notify",
        lambda: send_pending_notifications(settings),
        settings.notification_interval_seconds,
    )
    app.state.scheduler = scheduler
    logger.info("Payment service started (port %d)", settings.port)

    yield

    await scheduler.shutdown()
    await close_pool()
    logger.info("Payment service stopped")


def create_app(settings: Settings | None = None) -> FastAPI:
    cfg = settings or Settings()

    logging.basicConfig(
        level=getattr(logging, cfg.log_level.upper(), logging.INFO),
        format="%(asctime)s %(levelname)s %(name)s — %(message)s",
    )

    app = FastAPI(
        title="ClawTrace Payment",
        version="0.1.0",
        lifespan=lifespan,
    )
    app.state.settings = cfg

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "https://clawtrace.ai",
            "https://www.clawtrace.ai",
            "http://localhost:3000",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Override settings dependency
    from .auth import _get_settings

    app.dependency_overrides[_get_settings] = lambda: cfg

    # Register routers
    from .routers import consumption, credits, webhook

    app.include_router(consumption.router)
    app.include_router(credits.router)
    app.include_router(webhook.router)

    @app.get("/health")
    async def health():
        return {"status": "ok"}

    return app


app = create_app()
