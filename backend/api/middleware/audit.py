"""Audit logging middleware for tracking sensitive operations."""

import json
import logging
import time
from collections.abc import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

audit_logger = logging.getLogger("audit")


class AuditMiddleware(BaseHTTPMiddleware):
    """Logs write operations with actor and resource details."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)
        if request.method in ("POST", "PUT", "PATCH", "DELETE"):
            audit_logger.info(
                json.dumps({
                    "timestamp": time.time(),
                    "method": request.method,
                    "path": request.url.path,
                    "status": response.status_code,
                    "client_ip": request.client.host if request.client else None,
                })
            )
        return response
