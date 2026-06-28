"""Server-Sent Events endpoint for streaming chat responses."""

import asyncio
import json

from fastapi import APIRouter

from models.request_models import ChatRequest

router = APIRouter(prefix="/stream", tags=["stream"])


@router.post("/chat")
async def stream_chat(payload: ChatRequest):
    """Stream a chat response token by token using SSE."""

    async def event_generator():
        sample = f"Response to: {payload.message}"
        words = sample.split()
        for i, word in enumerate(words):
            chunk = {"token": word + (" " if i < len(words) - 1 else ""), "done": False}
            yield f"data: {json.dumps(chunk)}\n\n"
            await asyncio.sleep(0.05)
        yield f"data: {json.dumps({'token': '', 'done': True})}\n\n"

    from fastapi.responses import StreamingResponse
    return StreamingResponse(event_generator(), media_type="text/event-stream")
