"""Metrics and statistics endpoints for monitoring."""

import json
import os
import time

from fastapi import APIRouter

router = APIRouter(prefix="/metrics", tags=["metrics"])

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
CONVERSATIONS_DIR = os.path.join(DATA_DIR, "conversations")
_start_time = time.time()


@router.get("/stats")
async def get_stats() -> dict:
    uptime_seconds = time.time() - _start_time
    total_conversations = 0
    total_messages = 0
    if os.path.isdir(CONVERSATIONS_DIR):
        for fname in os.listdir(CONVERSATIONS_DIR):
            if fname.endswith(".json"):
                total_conversations += 1
                path = os.path.join(CONVERSATIONS_DIR, fname)
                with open(path, encoding="utf-8") as f:
                    conv = json.load(f)
                total_messages += len(conv.get("messages", []))
    return {
        "uptime_seconds": uptime_seconds,
        "total_conversations": total_conversations,
        "total_messages": total_messages,
        "memory_file_size_bytes": _get_file_size(os.path.join(DATA_DIR, "memory.json")),
    }


def _get_file_size(path: str) -> int:
    try:
        return os.path.getsize(path)
    except OSError:
        return 0
