"""Detailed health check endpoint with dependency verification."""

import os
import time

from fastapi import APIRouter

from utils.config import settings

router = APIRouter(tags=["system"])

_start_time = time.time()


def _check_disk() -> dict:
    data_dir = os.path.join(os.path.dirname(__file__), "..", "..", "data")
    os.makedirs(data_dir, exist_ok=True)
    return {"status": "ok", "path": data_dir}


def _check_config() -> dict:
    warnings = settings.validate_environment()
    return {"status": "warning" if warnings else "ok", "warnings": warnings}


@router.get("/health/detail")
async def health_detail() -> dict:
    return {
        "status": "ok",
        "app": settings.app_name,
        "version": "0.1.0",
        "environment": settings.environment,
        "uptime_seconds": round(time.time() - _start_time, 1),
        "dependencies": {
            "disk": _check_disk(),
            "config": _check_config(),
        },
    }
