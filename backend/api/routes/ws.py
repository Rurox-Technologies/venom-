"""WebSocket endpoint for real-time chat interactions."""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from utils.connection_manager import ConnectionManager

router = APIRouter(tags=["websocket"])
manager = ConnectionManager()


@router.websocket("/ws/chat/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str) -> None:
    await manager.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_text()
            reply = f"Echo: {data}"
            await manager.send_to_session(session_id, reply)
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
