"""Conversation context windowing and token-budget management."""

from memory.long_term import LongTermMemory
from memory.short_term import ShortTermMemory


class ContextManager:
    """Builds model-ready context from recent and long-term memory."""

    def __init__(self) -> None:
        self.short_term = ShortTermMemory()
        self.long_term = LongTermMemory()

    async def build_context(self, session_id: str, user_id: str = "default") -> str:
        parts = []
        recent = await self.short_term.get_recent(session_id)
        if recent:
            turns = []
            for t in recent[-10:]:
                if isinstance(t, dict):
                    user_msg = t.get("user", "")
                    asst_msg = t.get("assistant", "")
                    if user_msg:
                        turns.append(f"User: {user_msg}")
                    if asst_msg:
                        turns.append(f"Assistant: {asst_msg}")
            if turns:
                parts.append("Recent conversation:")
                parts.extend(turns)
        facts = await self.long_term.get_facts(user_id)
        if facts:
            fact_texts = [f.get("fact", "") for f in facts[-5:]]
            parts.append("Known facts: " + " | ".join(fact_texts))
        return "\n".join(parts) if parts else ""
