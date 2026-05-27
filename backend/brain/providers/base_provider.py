"""Base abstraction for AI model providers."""

from abc import ABC, abstractmethod


class BaseProvider(ABC):
    """Common async interface for cloud/local text generation providers."""

    @abstractmethod
    async def generate(self, prompt: str) -> str:
        raise NotImplementedError
