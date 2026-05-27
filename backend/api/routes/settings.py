"""Endpoints for assistant runtime settings."""

from fastapi import APIRouter

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("")
async def get_settings() -> dict[str, str]:
    # TODO: Read settings from config store.
    return {"status": "settings placeholder"}
