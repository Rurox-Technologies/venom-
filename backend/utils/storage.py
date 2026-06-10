"""Data directory initialization and path resolution utilities."""

import os


def get_data_dir() -> str:
    return os.path.join(os.path.dirname(__file__), "..", "data")


def get_conversations_dir() -> str:
    return os.path.join(get_data_dir(), "conversations")


def ensure_data_dirs() -> None:
    os.makedirs(get_conversations_dir(), exist_ok=True)


def resolve_data_path(*segments: str) -> str:
    return os.path.join(get_data_dir(), *segments)
