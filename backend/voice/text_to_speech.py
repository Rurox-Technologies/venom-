"""Text-to-speech conversion module using OpenAI TTS API."""

import httpx

from utils.config import settings
from utils.logger import get_logger

logger = get_logger(__name__)

TTS_URL = "https://api.openai.com/v1/audio/speech"


class TextToSpeechService:
    """Synthesizes text into speech via cloud TTS engine."""

    def __init__(self, api_key: str | None = None, voice: str = "alloy", model: str = "tts-1") -> None:
        self.api_key = api_key or settings.openai_api_key
        self.voice = voice or settings.tts_voice
        self.model = model

    async def synthesize(self, text: str) -> bytes:
        if not text.strip():
            return b""
        if self.api_key:
            return await self._synthesize_openai(text)
        logger.warning("No OpenAI API key configured for TTS")
        return b""

    async def _synthesize_openai(self, text: str) -> bytes:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                TTS_URL,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "input": text,
                    "voice": self.voice,
                    "response_format": "wav",
                },
            )
            resp.raise_for_status()
            return resp.content
