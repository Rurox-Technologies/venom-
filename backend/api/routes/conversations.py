"""Conversation management endpoints."""

import json
import os

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/conversations", tags=["conversations"])

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
CONVERSATIONS_DIR = os.path.join(DATA_DIR, "conversations")


def _ensure_dir() -> None:
    os.makedirs(CONVERSATIONS_DIR, exist_ok=True)


@router.get("")
async def list_conversations() -> list[dict]:
    _ensure_dir()
    conversations = []
    for fname in os.listdir(CONVERSATIONS_DIR):
        if fname.endswith(".json"):
            path = os.path.join(CONVERSATIONS_DIR, fname)
            with open(path, encoding="utf-8") as f:
                conversations.append(json.load(f))
    return sorted(conversations, key=lambda c: c.get("updated_at", ""), reverse=True)


@router.get("/{session_id}")
async def get_conversation(session_id: str) -> dict:
    _ensure_dir()
    path = os.path.join(CONVERSATIONS_DIR, f"{session_id}.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Conversation not found")
    with open(path, encoding="utf-8") as f:
        return json.load(f)


@router.delete("/{session_id}", status_code=204)
async def delete_conversation(session_id: str) -> None:
    _ensure_dir()
    path = os.path.join(CONVERSATIONS_DIR, f"{session_id}.json")
    if os.path.exists(path):
        os.remove(path)
