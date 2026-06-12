"""Response caching middleware for idempotent GET requests."""

import time
from collections.abc import Callable
from typing import Any

from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class CacheMiddleware(BaseHTTPMiddleware):
    """Caches GET responses in memory with TTL expiry."""

    def __init__(self, app: FastAPI, ttl_seconds: int = 60, max_size: int = 128) -> None:
        super().__init__(app)
        self.ttl_seconds = ttl_seconds
        self.max_size = max_size
        self._cache: dict[str, tuple[float, Response]] = {}

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if request.method != "GET":
            return await call_next(request)

        cache_key = f"{request.url.path}:{request.url.query}"
        now = time.time()

        if cache_key in self._cache:
            expiry, cached = self._cache[cache_key]
            if now < expiry:
                return cached
            del self._cache[cache_key]

        response = await call_next(request)
        if response.status_code == 200 and len(self._cache) < self.max_size:
            self._cache[cache_key] = (now + self.ttl_seconds, response)
        return response
