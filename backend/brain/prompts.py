"""Prompt templates and prompt-construction helpers."""

from brain.personality import PersonalityManager

_pm = PersonalityManager()


async def build_system_prompt(language: str = "en", mode: str = "balanced") -> str:
    base = f"You are Venom, a hybrid AI assistant. Respond in language code: {language}."
    style = await _pm.build_style_prompt(mode)
    return f"{base}\n{style}"
