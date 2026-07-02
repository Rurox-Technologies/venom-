"""OpenRouter provider integration using httpx."""

from collections.abc import AsyncGenerator

import httpx

from brain.providers.base_provider import BaseProvider
from utils.config import settings
from utils.logger import get_logger

logger = get_logger(__name__)

OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = "openrouter/auto"


class OpenRouterProvider(BaseProvider):
    """Calls OpenRouter-hosted models for cloud inference."""

    def __init__(self, api_key: str = "", model: str = DEFAULT_MODEL) -> None:
        self.api_key = api_key or settings.openrouter_api_key
        self.model = model

    async def generate(self, prompt: str, system_prompt: str | None = None) -> str:
        if not self.api_key:
            raise RuntimeError("OpenRouter API key not configured")
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                OPENROUTER_API,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={"model": self.model, "messages": messages},
            )
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]

    async def generate_stream(self, prompt: str, system_prompt: str | None = None) -> AsyncGenerator[str, None]:
        if not self.api_key:
            raise RuntimeError("OpenRouter API key not configured")
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        async with httpx.AsyncClient(timeout=120) as client:
            async with client.stream(
                "POST",
                OPENROUTER_API,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={"model": self.model, "messages": messages, "stream": True},
            ) as resp:
                resp.raise_for_status()
                async for line in resp.aiter_lines():
                    if line.startswith("data: "):
                        chunk = line[6:]
                        if chunk == "[DONE]":
                            break
                        import json
                        try:
                            data = json.loads(chunk)
                            delta = data.get("choices", [{}])[0].get("delta", {}).get("content", "")
                            if delta:
                                yield delta
                        except json.JSONDecodeError:
                            continue
