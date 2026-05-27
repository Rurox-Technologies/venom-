"""Conversation context windowing and token-budget management."""


class ContextManager:
    """Builds model-ready context from recent and long-term memory."""

    async def build_context(self, session_id: str) -> str:
        # TODO: Merge short-term and long-term memory safely.
        return f"Context placeholder for session {session_id}"
