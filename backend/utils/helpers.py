"""General helper functions used across the backend."""

import secrets
from datetime import datetime, timezone


def utc_now_iso() -> str:
    """Return current UTC timestamp in ISO format."""
    return datetime.now(timezone.utc).isoformat()


def generate_session_id() -> str:
    """Generate a cryptographically random session ID."""
    return secrets.token_hex(16)


def generate_user_id() -> str:
    """Generate a cryptographically random user ID."""
    return f"usr_{secrets.token_hex(8)}"


def format_timestamp(iso_str: str) -> str:
    """Format an ISO timestamp to a human-readable string."""
    try:
        dt = datetime.fromisoformat(iso_str)
        return dt.strftime("%Y-%m-%d %H:%M:%S UTC")
    except (ValueError, TypeError):
        return iso_str


def truncate(text: str, max_length: int = 100) -> str:
    """Truncate text with ellipsis if it exceeds max_length."""
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + "..."
