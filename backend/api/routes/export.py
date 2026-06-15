"""Conversation export endpoints."""

import json
import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse

router = APIRouter(prefix="/export", tags=["export"])

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
CONVERSATIONS_DIR = os.path.join(DATA_DIR, "conversations")


@router.get("/conversation/{session_id}/json")
async def export_conversation_json(session_id: str) -> dict:
    path = os.path.join(CONVERSATIONS_DIR, f"{session_id}.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Conversation not found")
    with open(path, encoding="utf-8") as f:
        return json.load(f)


@router.get("/conversation/{session_id}/text")
async def export_conversation_text(session_id: str) -> PlainTextResponse:
    path = os.path.join(CONVERSATIONS_DIR, f"{session_id}.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Conversation not found")
    with open(path, encoding="utf-8") as f:
        conv = json.load(f)
    lines = [f"Session: {conv.get('session_id', 'unknown')}", ""]
    for msg in conv.get("messages", []):
        role = msg.get("role", "unknown").capitalize()
        content = msg.get("content", "")
        lines.append(f"{role}: {content}")
    return PlainTextResponse("\n".join(lines), media_type="text/plain")
