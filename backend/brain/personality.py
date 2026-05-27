"""Personality mode logic and tone controls."""


class PersonalityManager:
    """Applies mode-specific style and behavior instructions."""

    async def build_style_prompt(self, mode: str) -> str:
        # TODO: Load persisted mode profiles and compose system prompt fragments.
        return f"Mode: {mode}. Keep response aligned with selected personality."
