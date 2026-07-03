"""Voice endpoints for speech-driven interactions."""

import base64

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import Response
from fastapi import UploadFile

router = APIRouter(prefix="/voice", tags=["voice"])


@router.post("/transcribe")
async def transcribe_audio(request: Request, file: UploadFile | None = None) -> dict:
    if file is None:
        raise HTTPException(status_code=400, detail="No audio file provided")
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty audio file")

    audio_mgr = request.app.state.audio_manager
    valid, msg = await audio_mgr.validate(content, file.filename or "")
    if not valid:
        raise HTTPException(status_code=400, detail=msg)

    normalized = await audio_mgr.normalize(content)
    stt = request.app.state.stt_service
    text = await stt.transcribe(normalized, file.filename or "audio.wav")
    if not text:
        raise HTTPException(status_code=501, detail="Speech-to-text not configured. Set OPENAI_API_KEY.")
    return {"text": text}


@router.post("/detect-wake-word")
async def detect_wake_word(request: Request, audio: str = "") -> dict:
    if not audio:
        raise HTTPException(status_code=400, detail="No audio data provided")
    try:
        audio_bytes = base64.b64decode(audio)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 audio data")
    detector = request.app.state.wake_word_detector
    detected = await detector.detect(audio_bytes)
    return {"detected": detected}


@router.post("/speak")
async def synthesize_speech(request: Request, text: str = "") -> Response:
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")
    tts = request.app.state.tts_service
    audio = await tts.synthesize(text)
    if not audio:
        raise HTTPException(status_code=501, detail="Text-to-speech not configured. Set OPENAI_API_KEY.")
    return Response(content=audio, media_type="audio/wav", headers={"Content-Disposition": "inline; filename=speech.wav"})
