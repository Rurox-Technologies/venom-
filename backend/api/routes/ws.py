"""WebSocket endpoint for real-time chat interactions."""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from utils.connection_manager import ConnectionManager

router = APIRouter(tags=["websocket"])
manager = ConnectionManager()


@router.websocket("/ws/chat/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str) -> None:
    await manager.connect(websocket, session_id)
    assistant = websocket.app.state.assistant
    try:
        while True:
            data = await websocket.receive_text()
            async for token in assistant.respond_stream(
                user_message=data,
                session_id=session_id,
                user_id="default",
            ):
                await websocket.send_text(token)
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
