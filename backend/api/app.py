"""FastAPI app assembly and router registration."""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.middleware.error_handler import register_error_handlers
from api.middleware.logging_middleware import LoggingMiddleware
from api.middleware.rate_limit import RateLimitMiddleware
from api.routes import chat, conversations, memory, modes, settings, voice
from brain.assistant import AssistantService
from brain.providers.ollama_provider import OllamaProvider
from brain.providers.openrouter_provider import OpenRouterProvider
from brain.router import ModelRouter
from utils.config import settings as app_settings
from voice.speech_to_text import SpeechToTextService
from voice.text_to_speech import TextToSpeechService
from voice.audio_manager import AudioManager
from voice.wakeword import WakeWordDetector


def create_app() -> FastAPI:
    app = FastAPI(title="Venom AI Assistant API", version="0.1.0")
    origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[origin.strip() for origin in origins if origin.strip()],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_middleware(RateLimitMiddleware, max_requests=60, window_seconds=60)
    app.add_middleware(LoggingMiddleware)

    primary = OpenRouterProvider()
    fallback = OllamaProvider()
    router = ModelRouter(primary_provider=primary, fallback_provider=fallback)
    app.state.assistant = AssistantService(router=router)

    app.state.stt_service = SpeechToTextService()
    app.state.tts_service = TextToSpeechService()
    app.state.audio_manager = AudioManager()
    app.state.wake_word_detector = WakeWordDetector()

    register_error_handlers(app)

    app.include_router(chat.router, prefix="/api")
    app.include_router(conversations.router, prefix="/api")
    app.include_router(voice.router, prefix="/api")
    app.include_router(memory.router, prefix="/api")
    app.include_router(modes.router, prefix="/api")
    app.include_router(settings.router, prefix="/api")

    @app.get("/health", tags=["system"])
    async def health_check() -> dict:
        return {
            "status": "ok",
            "app": app_settings.app_name,
            "version": "0.1.0",
            "environment": app_settings.environment,
        }

    return app
