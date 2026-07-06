"""Prompt templates and prompt-construction helpers."""

from brain.personality import PersonalityManager

_pm = PersonalityManager()

_LANGUAGE_INSTRUCTIONS = {
    "en": "Respond in English.",
    "hi": "हिंदी में उत्तर दें।",
    "es": "Responde en español.",
    "fr": "Répondez en français.",
    "de": "Antworten Sie auf Deutsch.",
}


async def build_system_prompt(language: str = "en", mode: str = "balanced") -> str:
    lang_instruction = _LANGUAGE_INSTRUCTIONS.get(language, _LANGUAGE_INSTRUCTIONS["en"])
    base = f"You are Venom, a hybrid AI assistant. {lang_instruction}"
    style = await _pm.build_style_prompt(mode)
    return f"{base}\n{style}"
