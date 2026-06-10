"""Input sanitization utilities for user-provided content."""

import re
import unicodedata


def strip_control_chars(text: str) -> str:
    return "".join(ch for ch in text if unicodedata.category(ch) not in ("Cc", "Cf") or ch in "\n\r\t")


def limit_length(text: str, max_length: int = 4096) -> str:
    return text[:max_length]


def sanitize_message(text: str, max_length: int = 4096) -> str:
    text = strip_control_chars(text)
    text = limit_length(text, max_length)
    return text.strip()


def sanitize_session_id(session_id: str) -> str:
    return re.sub(r"[^a-zA-Z0-9_\-]", "", session_id)[:128]


def sanitize_user_id(user_id: str) -> str:
    return re.sub(r"[^a-zA-Z0-9_\-@.]", "", user_id)[:64]
