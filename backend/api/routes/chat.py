"""Chat endpoints for text-based assistant interaction."""

from fastapi import APIRouter

from models.request_models import ChatRequest

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/message")
async def send_message(payload: ChatRequest) -> dict[str, str]:
    # TODO: Connect to assistant orchestration layer.
    return {"reply": f"Placeholder response for: {payload.message}"}
