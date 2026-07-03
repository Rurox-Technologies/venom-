"""Speech-to-text conversion module using OpenAI Whisper API."""

import os
import tempfile

import httpx

from utils.config import settings
from utils.logger import get_logger

logger = get_logger(__name__)

WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions"


class SpeechToTextService:
    """Converts audio to text via cloud or local STT engine."""

    def __init__(self, api_key: str | None = None, model: str = "whisper-1") -> None:
        self.api_key = api_key or settings.openai_api_key
        self.model = model

    async def transcribe(self, audio_data: bytes, filename: str = "audio.wav") -> str:
        if self.api_key:
            return await self._transcribe_whisper(audio_data, filename)
        logger.warning("No OpenAI API key configured for STT")
        return ""

    async def _transcribe_whisper(self, audio_data: bytes, filename: str) -> str:
        async with httpx.AsyncClient(timeout=120) as client:
            files = {"file": (filename, audio_data, "audio/wav")}
            data = {"model": self.model, "language": "en"}
            resp = await client.post(
                WHISPER_URL,
                headers={"Authorization": f"Bearer {self.api_key}"},
                files=files,
                data=data,
            )
            resp.raise_for_status()
            result = resp.json()
            return result.get("text", "")
