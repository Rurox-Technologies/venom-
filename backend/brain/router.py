"""Routing layer to select cloud or local model providers."""

from collections.abc import AsyncGenerator

from brain.providers.base_provider import BaseProvider
from utils.logger import get_logger

logger = get_logger(__name__)


class ModelRouter:
    """Routes generation requests across available providers with fallback."""

    def __init__(self, primary_provider: BaseProvider, fallback_provider: BaseProvider | None = None) -> None:
        self.primary_provider = primary_provider
        self.fallback_provider = fallback_provider

    async def generate(self, prompt: str, system_prompt: str | None = None) -> str:
        try:
            return await self.primary_provider.generate(prompt, system_prompt)
        except Exception as e:
            logger.warning("Primary provider failed: %s", e)
            if self.fallback_provider is None:
                raise
            logger.info("Falling back to secondary provider")
            return await self.fallback_provider.generate(prompt, system_prompt)

    async def generate_stream(self, prompt: str, system_prompt: str | None = None) -> AsyncGenerator[str, None]:
        try:
            async for token in self.primary_provider.generate_stream(prompt, system_prompt):
                yield token
        except Exception as e:
            logger.warning("Primary stream failed: %s", e)
            if self.fallback_provider is None:
                raise
            logger.info("Falling back to secondary stream provider")
            async for token in self.fallback_provider.generate_stream(prompt, system_prompt):
                yield token
