"""General helper functions used across the backend."""

from datetime import datetime, timezone


def utc_now_iso() -> str:
    """Return current UTC timestamp in ISO format."""
    return datetime.now(timezone.utc).isoformat()
