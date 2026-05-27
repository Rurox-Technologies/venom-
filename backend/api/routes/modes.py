"""Endpoints for personality and behavior mode selection."""

from fastapi import APIRouter

router = APIRouter(prefix="/modes", tags=["modes"])


@router.get("")
async def list_modes() -> dict[str, list[str]]:
    # TODO: Fetch dynamic modes from persistent settings.
    return {"modes": ["balanced", "creative", "concise"]}
