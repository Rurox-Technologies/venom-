"""Short-term session memory implementation."""


class ShortTermMemory:
    """Manages recent conversational turns."""

    async def get_recent(self, session_id: str) -> list[dict[str, str]]:
        # TODO: Replace with in-memory cache or Redis implementation.
        return []
