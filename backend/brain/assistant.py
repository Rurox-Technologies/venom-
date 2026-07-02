"""Top-level assistant coordinator for request lifecycle."""

from brain.context_manager import ContextManager
from brain.prompts import build_system_prompt
from brain.router import ModelRouter
from memory.memory_manager import MemoryManager
from utils.logger import get_logger

logger = get_logger(__name__)


class AssistantService:
    """Orchestrates context, model routing, memory, and response generation."""

    def __init__(self, router: ModelRouter) -> None:
        self.router = router
        self.context = ContextManager()
        self.memory = MemoryManager()

    async def respond(self, user_message: str, session_id: str = "", user_id: str = "default", language: str = "en", mode: str = "balanced") -> str:
        system_prompt = await build_system_prompt(language, mode)
        context = await self.context.build_context(session_id, user_id)
        full_prompt = f"{context}\nUser: {user_message}" if context else user_message
        logger.info("Generating response for session=%s mode=%s", session_id, mode)
        reply = await self.router.generate(full_prompt, system_prompt)
        await self.memory.store_interaction(user_id, user_message, reply, session_id)
        return reply

    async def respond_stream(self, user_message: str, session_id: str = "", user_id: str = "default", language: str = "en", mode: str = "balanced"):
        system_prompt = await build_system_prompt(language, mode)
        context = await self.context.build_context(session_id, user_id)
        full_prompt = f"{context}\nUser: {user_message}" if context else user_message
        logger.info("Streaming response for session=%s mode=%s", session_id, mode)
        full_reply = ""
        async for token in self.router.generate_stream(full_prompt, system_prompt):
            full_reply += token
            yield token
        await self.memory.store_interaction(user_id, user_message, full_reply, session_id)
