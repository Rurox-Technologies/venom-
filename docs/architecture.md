# Architecture

## High-Level Design

Venom uses a decoupled architecture:

- `backend/` handles API, AI orchestration, memory, voice services, and integrations.
- `frontend/` handles the interactive futuristic assistant UI.

## Backend Layers

- `api/`: FastAPI route layer (`chat`, `voice`, `memory`, `modes`, `settings`)
- `brain/`: assistant orchestration, prompting, provider routing
- `memory/`: short-term, long-term, summarization modules
- `voice/`: speech-to-text, text-to-speech, wake-word placeholders
- `integrations/`: future WhatsApp bridge support
- `utils/`: config, constants, helpers, logging

## Frontend Layers

- `src/app`: App Router pages and global styles
- `src/components`: modular chat, voice, sidebar, settings, and shared UI elements
- `src/context`: chat and settings state containers
- `src/hooks`: reusable domain hooks
- `src/lib`: API access layer

## Runtime Flow (Planned)

1. User sends text/voice from frontend.
2. Backend route validates payload.
3. Assistant service builds context and personality prompt.
4. Model router selects OpenRouter or Ollama provider.
5. Memory manager stores interaction and updates summaries.
6. Response returns to frontend for display/audio playback.
