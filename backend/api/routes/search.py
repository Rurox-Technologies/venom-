"""Search and filter endpoints for messages and conversations."""

import json
import os

from fastapi import APIRouter, Query

router = APIRouter(prefix="/search", tags=["search"])

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
CONVERSATIONS_DIR = os.path.join(DATA_DIR, "conversations")


@router.get("/messages")
async def search_messages(q: str = Query(..., min_length=1), session_id: str | None = None) -> list[dict]:
    results = []
    if not os.path.isdir(CONVERSATIONS_DIR):
        return results
    for fname in os.listdir(CONVERSATIONS_DIR):
        if not fname.endswith(".json"):
            continue
        if session_id and fname != f"{session_id}.json":
            continue
        path = os.path.join(CONVERSATIONS_DIR, fname)
        with open(path, encoding="utf-8") as f:
            conv = json.load(f)
        for msg in conv.get("messages", []):
            if q.lower() in msg.get("content", "").lower():
                results.append({**msg, "session_id": conv.get("session_id")})
    return sorted(results, key=lambda r: r.get("timestamp", ""), reverse=True)
