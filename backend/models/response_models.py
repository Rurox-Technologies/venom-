"""Pydantic response schemas for API endpoints."""

from datetime import datetime

from pydantic import BaseModel


class ChatResponse(BaseModel):
    reply: str
    timestamp: str = ""

    def model_post_init(self, _context) -> None:
        if not self.timestamp:
            self.timestamp = datetime.utcnow().isoformat()


class ErrorResponse(BaseModel):
    detail: str
    error_code: str | None = None


class HealthResponse(BaseModel):
    status: str
    app: str = "Venom"
    version: str = "0.1.0"
    environment: str = "development"
