"""Unified memory manager orchestrating short and long-term storage."""

from datetime import datetime, timezone

from memory.long_term import LongTermMemory
from memory.short_term import ShortTermMemory
from memory.summarizer import MemorySummarizer


class MemoryManager:
    """Handles read/write operations across memory layers with archival."""

    def __init__(self) -> None:
        self.short_term = ShortTermMemory()
        self.long_term = LongTermMemory()
        self.summarizer = MemorySummarizer()
        self._archive_limit = 50

    async def store_interaction(self, user_id: str, message: str, reply: str, session_id: str | None = None) -> None:
        turn = {"user": message, "assistant": reply, "timestamp": datetime.now(timezone.utc).isoformat()}
        if session_id:
            recent = await self.short_term.get_recent(session_id)
            recent.append(turn)
            if len(recent) > self._archive_limit:
                summary = await self.summarizer.summarize(recent)
                await self.long_term.upsert_fact(user_id, summary)
                recent.clear()
        else:
            await self.long_term.upsert_fact(user_id, f"Q: {message} | A: {reply}")

    async def get_recent_context(self, session_id: str) -> list[dict]:
        return await self.short_term.get_recent(session_id)

    async def archive_old(self, user_id: str, before_days: int = 30) -> int:
        return await self.long_term.archive_old_facts(user_id, before_days)
