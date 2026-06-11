"""WebSocket connection manager for session-based real-time messaging."""

from fastapi import WebSocket


class ConnectionManager:
    """Manages active WebSocket connections grouped by session."""

    def __init__(self) -> None:
        self._sessions: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: str) -> None:
        await websocket.accept()
        if session_id not in self._sessions:
            self._sessions[session_id] = []
        self._sessions[session_id].append(websocket)

    def disconnect(self, websocket: WebSocket, session_id: str) -> None:
        if session_id in self._sessions:
            self._sessions[session_id] = [ws for ws in self._sessions[session_id] if ws != websocket]
            if not self._sessions[session_id]:
                del self._sessions[session_id]

    async def send_to_session(self, session_id: str, message: str) -> None:
        for ws in self._sessions.get(session_id, []):
            await ws.send_text(message)

    async def broadcast(self, message: str) -> None:
        for connections in self._sessions.values():
            for ws in connections:
                await ws.send_text(message)
