"""Performance monitoring middleware for request timing."""

import time
from collections.abc import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class PerformanceMiddleware(BaseHTTPMiddleware):
    """Tracks and logs request duration with slow-request warnings."""

    def __init__(self, app, slow_threshold_ms: int = 500) -> None:
        super().__init__(app)
        self.slow_threshold = slow_threshold_ms

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - start) * 1000
        response.headers["X-Response-Time-MS"] = str(round(elapsed_ms, 1))
        if elapsed_ms > self.slow_threshold:
            response.headers["X-Slow-Request"] = "1"
        return response
