"""Wake-word detection module with energy-based and Porcupine support."""

import math
import struct

from utils.logger import get_logger

logger = get_logger(__name__)

WAKE_PHRASE = "venom"
SAMPLE_WIDTH = 2
SAMPLE_RATE = 16000
ENERGY_THRESHOLD = 500


class WakeWordDetector:
    """Detects wake phrases in audio streams.

    Uses pvporcupine if available, otherwise falls back to
    simple energy-based speech detection.
    """

    def __init__(self, sensitivity: float = 0.5) -> None:
        self.sensitivity = sensitivity
        self._porcupine = None
        self._try_init_porcupine()

    def _try_init_porcupine(self) -> None:
        try:
            import pvporcupine
            self._porcupine = pvporcupine.create(
                keywords=[WAKE_PHRASE],
                sensitivities=[self.sensitivity],
            )
            logger.info("Porcupine wake-word engine initialized for '%s'", WAKE_PHRASE)
        except ImportError:
            logger.info("pvporcupine not available, using energy-based detection")

    async def detect(self, audio_chunk: bytes) -> bool:
        if self._porcupine:
            return self._detect_porcupine(audio_chunk)
        return self._detect_energy(audio_chunk)

    def _detect_porcupine(self, audio_chunk: bytes) -> bool:
        try:
            pcm = struct.unpack_from(f"<{len(audio_chunk) // SAMPLE_WIDTH}h", audio_chunk)
            result = self._porcupine.process(pcm)
            return result >= 0
        except Exception as e:
            logger.debug("Porcupine error: %s", e)
            return False

    def _detect_energy(self, audio_chunk: bytes) -> bool:
        if len(audio_chunk) < SAMPLE_WIDTH:
            return False
        try:
            count = len(audio_chunk) // SAMPLE_WIDTH
            samples = struct.unpack_from(f"<{count}h", audio_chunk[:count * SAMPLE_WIDTH])
            rms = math.sqrt(sum(s * s for s in samples) / len(samples))
            return rms > ENERGY_THRESHOLD
        except (struct.error, ZeroDivisionError):
            return False

    def close(self) -> None:
        if self._porcupine:
            self._porcupine.delete()
