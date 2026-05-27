"""Unified memory manager orchestrating short and long-term storage."""


class MemoryManager:
    """Handles read/write operations across memory layers."""

    async def store_interaction(self, user_id: str, message: str, reply: str) -> None:
        # TODO: Persist event and trigger summarization workflow.
        return None
