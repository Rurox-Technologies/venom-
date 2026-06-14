"""Pydantic request schemas for API endpoints."""

from pydantic import BaseModel, Field, field_validator

from utils.constants import (
    DEFAULT_LANGUAGE,
    DEFAULT_MODE,
    MAX_MESSAGE_LENGTH,
    MAX_SESSION_ID_LENGTH,
    MAX_USER_ID_LENGTH,
    LanguageEnum,
    ModeEnum,
)


class ChatRequest(BaseModel):
    """Incoming chat message payload with enhanced validation."""

    user_id: str = Field(..., min_length=1, max_length=MAX_USER_ID_LENGTH, description="Unique user identifier")
    session_id: str = Field(..., min_length=1, max_length=MAX_SESSION_ID_LENGTH, description="Unique session identifier")
    message: str = Field(..., min_length=1, max_length=MAX_MESSAGE_LENGTH, description="User message content")
    language: LanguageEnum = Field(default=LanguageEnum.EN, description="ISO language code")
    mode: ModeEnum = Field(default=ModeEnum.BALANCED, description="Response personality mode")

    @field_validator("message")
    @classmethod
    def message_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Message must not be blank")
        return v.strip()
