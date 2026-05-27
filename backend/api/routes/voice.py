"""Voice endpoints for speech-driven interactions."""

from fastapi import APIRouter

router = APIRouter(prefix="/voice", tags=["voice"])


@router.post("/transcribe")
async def transcribe_audio() -> dict[str, str]:
    # TODO: Accept file stream and call speech-to-text pipeline.
    return {"text": "transcription placeholder"}


@router.post("/speak")
async def synthesize_speech() -> dict[str, str]:
    # TODO: Generate audio output via text-to-speech provider.
    return {"audio_url": "placeholder://audio"}
