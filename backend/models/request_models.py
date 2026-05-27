"""Pydantic request schemas for API endpoints."""

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Incoming chat message payload."""

    user_id: str = Field(..., min_length=1)
    session_id: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1)
    language: str = Field(default="en", min_length=2)
    mode: str = Field(default="balanced", min_length=3)
