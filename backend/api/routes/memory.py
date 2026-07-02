"""Memory endpoints for user context and recall management."""

from fastapi import APIRouter, Request

router = APIRouter(prefix="/memory", tags=["memory"])


@router.get("/summary")
async def get_memory_summary(request: Request) -> dict:
    assistant = request.app.state.assistant
    facts = await assistant.memory.long_term.get_facts("default")
    recent = await assistant.memory.short_term.get_recent("default")
    return {
        "facts": facts[-10:],
        "recent_turns": len(recent),
        "total_facts": len(facts),
    }
