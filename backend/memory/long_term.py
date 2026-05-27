"""Long-term memory implementation for durable user context."""


class LongTermMemory:
    """Persists important facts/preferences across sessions."""

    async def upsert_fact(self, user_id: str, fact: str) -> None:
        # TODO: Persist in vector store or database.
        return None
