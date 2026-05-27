"""Top-level assistant coordinator for request lifecycle."""

from brain.router import ModelRouter


class AssistantService:
    """Orchestrates context, model routing, and response generation."""

    def __init__(self, router: ModelRouter) -> None:
        self.router = router

    async def respond(self, user_message: str) -> str:
        # TODO: Add context retrieval, memory writes, and post-processing.
        return await self.router.generate(user_message)
