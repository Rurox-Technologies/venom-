"""FastAPI app assembly and router registration."""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.middleware.error_handler import register_error_handlers
from api.middleware.logging_middleware import LoggingMiddleware
from api.middleware.rate_limit import RateLimitMiddleware
from api.routes import chat, memory, modes, settings, voice


def create_app() -> FastAPI:
    app = FastAPI(title="Venom AI Assistant API", version="0.1.0")
    origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[origin.strip() for origin in origins if origin.strip()],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_middleware(RateLimitMiddleware, max_requests=60, window_seconds=60)
    app.add_middleware(LoggingMiddleware)

    register_error_handlers(app)

    app.include_router(chat.router, prefix="/api")
    app.include_router(voice.router, prefix="/api")
    app.include_router(memory.router, prefix="/api")
    app.include_router(modes.router, prefix="/api")
    app.include_router(settings.router, prefix="/api")

    @app.get("/health", tags=["system"])
    async def health_check() -> dict[str, str]:
        return {"status": "ok"}

    return app
