from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import Settings
from .database import close_pool, run_migrations
from .models import HealthResponse
from .routers import auth, keys, tenant


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = Settings()
    if settings.database_url:
        await run_migrations(settings)
    yield
    await close_pool()


def create_app(settings: Settings | None = None) -> FastAPI:
    cfg = settings or Settings()

    app = FastAPI(
        title="ClawTrace Backend",
        description=(
            "Authentication, tenant management, and observe key issuance for ClawTrace. "
            "Bridges clawtrace-ui session tokens to tenant_id-scoped data access."
        ),
        version="0.1.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["https://clawtrace.ai", "http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Bind this settings instance to the dependency so all routers share it
    from .auth import get_settings as _get_settings
    app.dependency_overrides[_get_settings] = lambda: cfg

    app.include_router(auth.router)
    app.include_router(keys.router)
    app.include_router(tenant.router)

    @app.get("/healthz", response_model=HealthResponse, tags=["health"])
    async def healthz() -> HealthResponse:
        return HealthResponse()

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn
    settings = Settings()
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=True)
