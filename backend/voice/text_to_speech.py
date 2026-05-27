"""Text-to-speech conversion module."""


class TextToSpeechService:
    """Synthesizes assistant replies into speech."""

    async def synthesize(self, text: str) -> bytes:
        # TODO: Integrate local/cloud TTS engine.
        return b""
