"""Ollama provider integration placeholder."""

from brain.providers.base_provider import BaseProvider


class OllamaProvider(BaseProvider):
    """Calls local Ollama runtime for on-device inference."""

    async def generate(self, prompt: str) -> str:
        # TODO: Integrate Ollama REST client with model availability checks.
        return f"Ollama placeholder response for: {prompt}"
