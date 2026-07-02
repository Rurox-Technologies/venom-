"""Base abstraction for AI model providers with streaming support."""

from abc import ABC, abstractmethod
from collections.abc import AsyncGenerator


class BaseProvider(ABC):
    """Common async interface for cloud/local text generation providers."""

    @abstractmethod
    async def generate(self, prompt: str, system_prompt: str | None = None) -> str:
        raise NotImplementedError

    async def generate_stream(self, prompt: str, system_prompt: str | None = None) -> AsyncGenerator[str, None]:
        yield await self.generate(prompt, system_prompt)
