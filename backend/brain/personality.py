"""Personality mode logic and tone controls."""

PERSONALITY_PROFILES = {
    "balanced": {
        "label": "Balanced",
        "prompt": "Respond clearly and neutrally. Be helpful and concise.",
    },
    "creative": {
        "label": "Creative",
        "prompt": "Be imaginative and expressive. Use vivid language and explore ideas freely.",
    },
    "concise": {
        "label": "Concise",
        "prompt": "Be extremely brief and direct. Use as few words as possible while being accurate.",
    },
    "sarcastic": {
        "label": "Sarcastic",
        "prompt": "Be witty and sarcastic. Use irony and dry humor, but stay helpful underneath.",
    },
    "friendly": {
        "label": "Friendly",
        "prompt": "Be warm, approachable, and encouraging. Use casual friendly language.",
    },
    "professional": {
        "label": "Professional",
        "prompt": "Be formal, precise, and business-appropriate. Use professional language.",
    },
    "chaos": {
        "label": "Chaos",
        "prompt": "Be unpredictable and wild. Mix humor, absurdity, and unexpected responses.",
    },
}


class PersonalityManager:
    """Applies mode-specific style and behavior instructions."""

    async def build_style_prompt(self, mode: str) -> str:
        profile = PERSONALITY_PROFILES.get(mode, PERSONALITY_PROFILES["balanced"])
        return profile["prompt"]

    def list_modes(self) -> list[dict]:
        return [
            {"id": k, "label": v["label"], "description": v["prompt"]}
            for k, v in PERSONALITY_PROFILES.items()
        ]
