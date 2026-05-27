"""Routing layer to select cloud or local model providers."""

from brain.providers.base_provider import BaseProvider


class ModelRouter:
    """Routes generation requests across available providers."""

    def __init__(self, primary_provider: BaseProvider, fallback_provider: BaseProvider | None = None) -> None:
        self.primary_provider = primary_provider
        self.fallback_provider = fallback_provider

    async def generate(self, prompt: str) -> str:
        try:
            return await self.primary_provider.generate(prompt)
        except Exception:
            if self.fallback_provider is None:
                raise
            return await self.fallback_provider.generate(prompt)
