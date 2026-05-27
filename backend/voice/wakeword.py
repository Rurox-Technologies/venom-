"""Wake-word detection module."""


class WakeWordDetector:
    """Listens for configurable wake phrases."""

    async def detect(self, audio_chunk: bytes) -> bool:
        # TODO: Integrate wake-word engine.
        return False
