"""Short-term session memory implementation with in-memory cache."""


class ShortTermMemory:
    """Manages recent conversational turns using an in-memory store."""

    def __init__(self) -> None:
        self._sessions: dict[str, list[dict]] = {}

    async def get_recent(self, session_id: str) -> list[dict]:
        if session_id not in self._sessions:
            self._sessions[session_id] = []
        return self._sessions[session_id]

    async def add_turn(self, session_id: str, turn: dict) -> None:
        if session_id not in self._sessions:
            self._sessions[session_id] = []
        self._sessions[session_id].append(turn)

    async def clear_session(self, session_id: str) -> None:
        self._sessions.pop(session_id, None)
