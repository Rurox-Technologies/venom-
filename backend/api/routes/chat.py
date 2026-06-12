"""Chat endpoints for text-based assistant interaction."""

import json
import os

from fastapi import APIRouter

from models.request_models import ChatRequest
from utils.helpers import utc_now_iso

router = APIRouter(prefix="/chat", tags=["chat"])

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
CONVERSATIONS_DIR = os.path.join(DATA_DIR, "conversations")


def _save_message(session_id: str, user_msg: str, reply: str) -> None:
    os.makedirs(CONVERSATIONS_DIR, exist_ok=True)
    path = os.path.join(CONVERSATIONS_DIR, f"{session_id}.json")
    conversation = {"session_id": session_id, "messages": [], "updated_at": utc_now_iso()}
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            conversation = json.load(f)
    conversation["messages"].append({"role": "user", "content": user_msg, "timestamp": utc_now_iso()})
    conversation["messages"].append({"role": "assistant", "content": reply, "timestamp": utc_now_iso()})
    conversation["updated_at"] = utc_now_iso()
    with open(path, "w", encoding="utf-8") as f:
        json.dump(conversation, f, indent=2, ensure_ascii=False)


@router.post("/message")
async def send_message(payload: ChatRequest) -> dict[str, str]:
    reply = f"Placeholder response for: {payload.message}"
    _save_message(payload.session_id, payload.message, reply)
    return {"reply": reply}
