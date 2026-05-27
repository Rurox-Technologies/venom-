"""OpenRouter provider integration placeholder."""

from brain.providers.base_provider import BaseProvider


class OpenRouterProvider(BaseProvider):
    """Calls OpenRouter-hosted models for cloud inference."""

    async def generate(self, prompt: str) -> str:
        # TODO: Integrate OpenRouter API client with retries and tracing.
        return f"OpenRouter placeholder response for: {prompt}"
