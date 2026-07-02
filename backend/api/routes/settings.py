"""Endpoints for assistant runtime settings."""

import json
import os

from fastapi import APIRouter, Request

from utils.config import settings as app_settings

router = APIRouter(prefix="/settings", tags=["settings"])

SETTINGS_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "settings.json")


def _load_settings() -> dict:
    if os.path.exists(SETTINGS_PATH):
        with open(SETTINGS_PATH, encoding="utf-8") as f:
            return json.load(f)
    return {}


def _save_settings(data: dict) -> None:
    os.makedirs(os.path.dirname(SETTINGS_PATH), exist_ok=True)
    with open(SETTINGS_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


@router.get("")
async def get_settings(request: Request) -> dict:
    stored = _load_settings()
    return {
        "provider": stored.get("provider", "hybrid"),
        "personality": stored.get("personality", "balanced"),
        "language": stored.get("language", "en"),
        "environment": app_settings.environment,
        "privacy_mode": stored.get("privacy_mode", False),
        "memory_enabled": stored.get("memory_enabled", True),
    }


@router.post("")
async def update_settings(payload: dict, request: Request) -> dict:
    _save_settings(payload)
    return {"status": "saved"}
