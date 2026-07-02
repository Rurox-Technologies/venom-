"""Ollama provider integration using httpx."""

import json
from collections.abc import AsyncGenerator

import httpx

from brain.providers.base_provider import BaseProvider
from utils.config import settings
from utils.logger import get_logger

logger = get_logger(__name__)

DEFAULT_MODEL = "llama3.2"


class OllamaProvider(BaseProvider):
    """Calls local Ollama runtime for on-device inference."""

    def __init__(self, base_url: str = "", model: str = DEFAULT_MODEL) -> None:
        self.base_url = (base_url or settings.ollama_base_url).rstrip("/")
        self.model = model

    async def generate(self, prompt: str, system_prompt: str | None = None) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                f"{self.base_url}/api/chat",
                json={"model": self.model, "messages": messages, "stream": False},
            )
            resp.raise_for_status()
            data = resp.json()
            return data["message"]["content"]

    async def generate_stream(self, prompt: str, system_prompt: str | None = None) -> AsyncGenerator[str, None]:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        async with httpx.AsyncClient(timeout=300) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/api/chat",
                json={"model": self.model, "messages": messages, "stream": True},
            ) as resp:
                resp.raise_for_status()
                async for line in resp.aiter_lines():
                    if not line.strip():
                        continue
                    try:
                        data = json.loads(line)
                        content = data.get("message", {}).get("content", "")
                        if content:
                            yield content
                    except json.JSONDecodeError:
                        continue
