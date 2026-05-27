"""Prompt templates and prompt-construction helpers."""


def build_system_prompt(language: str = "en") -> str:
    """Return base system prompt for multilingual support."""
    return f"You are Venom. Respond clearly and helpfully in language: {language}."
