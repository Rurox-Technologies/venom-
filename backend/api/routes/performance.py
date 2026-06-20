"""Performance data endpoint for internal monitoring."""

import statistics
import time

from fastapi import APIRouter

router = APIRouter(prefix="/performance", tags=["performance"])

_latencies: list[float] = []


def record_latency(ms: float) -> None:
    _latencies.append(ms)
    if len(_latencies) > 1000:
        _latencies.pop(0)


@router.get("/stats")
async def get_performance_stats() -> dict:
    if not _latencies:
        return {"status": "no_data"}
    return {
        "samples": len(_latencies),
        "avg_ms": round(statistics.mean(_latencies), 1),
        "p50_ms": round(statistics.median(_latencies), 1),
        "max_ms": round(max(_latencies), 1),
        "min_ms": round(min(_latencies), 1),
    }
