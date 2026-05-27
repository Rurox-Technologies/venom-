"""Speech-to-text conversion module."""


class SpeechToTextService:
    """Converts user audio to text asynchronously."""

    async def transcribe(self, audio_path: str) -> str:
        # TODO: Integrate Whisper or cloud STT provider.
        return "transcript placeholder"
