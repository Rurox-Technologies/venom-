"""Server-Sent Events endpoint for streaming chat responses."""

import json
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from models.request_models import ChatRequest

router = APIRouter(prefix="/stream", tags=["stream"])


@router.post("/chat")
async def stream_chat(payload: ChatRequest, request: Request):
    assistant = request.app.state.assistant

    async def event_generator():
        async for token in assistant.respond_stream(
            user_message=payload.message,
            session_id=payload.session_id,
            user_id=payload.user_id,
            language=payload.language.value if hasattr(payload.language, "value") else str(payload.language),
            mode=payload.mode.value if hasattr(payload.mode, "value") else str(payload.mode),
        ):
            yield f"data: {json.dumps({'token': token, 'done': False})}\n\n"
        yield f"data: {json.dumps({'token': '', 'done': True})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
