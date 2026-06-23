"""Message bookmark and pinning endpoints."""

import json
import os
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/bookmarks", tags=["bookmarks"])

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
BOOKMARKS_PATH = os.path.join(DATA_DIR, "bookmarks.json")


def _load_bookmarks() -> dict:
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(BOOKMARKS_PATH):
        return {}
    with open(BOOKMARKS_PATH, encoding="utf-8") as f:
        return json.load(f)


def _save_bookmarks(data: dict) -> None:
    with open(BOOKMARKS_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


@router.get("")
async def list_bookmarks(session_id: str | None = None) -> list[dict]:
    data = _load_bookmarks()
    items = data.get("items", [])
    if session_id:
        items = [it for it in items if it.get("session_id") == session_id]
    return sorted(items, key=lambda x: x.get("created_at", ""), reverse=True)


@router.post("")
async def add_bookmark(session_id: str, message_id: str, content: str) -> dict:
    data = _load_bookmarks()
    if "items" not in data:
        data["items"] = []
    data["items"].append({
        "session_id": session_id,
        "message_id": message_id,
        "content": content[:200],
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    _save_bookmarks(data)
    return {"status": "bookmarked"}


@router.delete("/{message_id}")
async def remove_bookmark(message_id: str) -> dict:
    data = _load_bookmarks()
    data["items"] = [it for it in data.get("items", []) if it.get("message_id") != message_id]
    _save_bookmarks(data)
    return {"status": "removed"}
