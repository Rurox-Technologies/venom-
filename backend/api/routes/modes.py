"""Endpoints for personality and behavior mode selection."""

from fastapi import APIRouter

from brain.personality import PersonalityManager

router = APIRouter(prefix="/modes", tags=["modes"])

_pm = PersonalityManager()


@router.get("")
async def list_modes() -> dict:
    return {"modes": _pm.list_modes()}
