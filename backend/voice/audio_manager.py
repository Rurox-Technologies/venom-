"""Audio preprocessing and validation utilities."""

import io
import os
import wave

from utils.config import settings
from utils.logger import get_logger

logger = get_logger(__name__)

ALLOWED_FORMATS = {"wav", "mp3", "ogg", "m4a", "webm"}
MAX_SIZE = settings.audio_max_size_mb * 1024 * 1024


class AudioManager:
    """Validates, normalizes, and chunks audio streams."""

    async def validate(self, audio_data: bytes, filename: str = "") -> tuple[bool, str]:
        if not audio_data:
            return False, "Empty audio data"
        if len(audio_data) > MAX_SIZE:
            return False, f"Audio exceeds maximum size of {settings.audio_max_size_mb}MB"
        ext = os.path.splitext(filename)[1].lstrip(".").lower() if filename else ""
        if ext and ext not in ALLOWED_FORMATS:
            return False, f"Unsupported format: {ext}. Allowed: {', '.join(sorted(ALLOWED_FORMATS))}"
        if ext == "wav":
            try:
                with wave.open(io.BytesIO(audio_data), "rb") as wf:
                    if wf.getnchannels() == 0 or wf.getframerate() == 0:
                        return False, "Invalid WAV file"
            except wave.Error as e:
                return False, f"Invalid WAV file: {e}"
        return True, ""

    async def normalize(self, audio_data: bytes, target_rate: int = 16000) -> bytes:
        if not audio_data:
            return b""
        try:
            with wave.open(io.BytesIO(audio_data), "rb") as wf:
                params = wf.getparams()
                frames = wf.readframes(wf.getnframes())
            if params.framerate == target_rate and params.sampwidth == 2 and params.nchannels == 1:
                return audio_data
            with io.BytesIO() as out:
                with wave.open(out, "wb") as wf:
                    wf.setnchannels(1)
                    wf.setsampwidth(2)
                    wf.setframerate(target_rate)
                    wf.writeframes(frames)
                return out.getvalue()
        except (wave.Error, OSError):
            logger.warning("Could not normalize non-WAV audio, passing through")
            return audio_data

    def estimate_duration(self, audio_data: bytes, sample_rate: int = 16000) -> float:
        return len(audio_data) / (sample_rate * 2)
