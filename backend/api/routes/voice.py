"""Voice endpoints for speech-driven interactions."""

from fastapi import APIRouter, HTTPException, UploadFile

router = APIRouter(prefix="/voice", tags=["voice"])


@router.post("/transcribe")
async def transcribe_audio(file: UploadFile | None = None) -> dict:
    if file is None:
        raise HTTPException(status_code=400, detail="No audio file provided")
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty audio file")
    from utils.logger import get_logger
    get_logger(__name__).warning("STT not yet integrated, received %d bytes", len(content))
    raise HTTPException(status_code=501, detail="Speech-to-text not yet configured")


@router.post("/speak")
async def synthesize_speech(text: str = "") -> dict:
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")
    from utils.logger import get_logger
    get_logger(__name__).warning("TTS not yet integrated for text: %s", text[:50])
    raise HTTPException(status_code=501, detail="Text-to-speech not yet configured")
