"""Memory endpoints for user context and recall management."""

from fastapi import APIRouter

router = APIRouter(prefix="/memory", tags=["memory"])


@router.get("/summary")
async def get_memory_summary() -> dict[str, str]:
    # TODO: Return compressed user/session memory snapshot.
    return {"summary": "memory summary placeholder"}
