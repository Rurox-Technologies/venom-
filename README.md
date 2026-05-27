# Venom

Venom is a hybrid personality-driven AI assistant that combines cloud intelligence with privacy-first local inference, voice interaction, adaptive memory, multilingual communication, and a futuristic AI operating system interface.

## Project Overview

Venom supports both:

- OpenRouter cloud AI
- Ollama local AI

with dynamic switching between them.

## Complete Feature List

- Full catalog: [docs/feature-list.md](docs/feature-list.md)
- Hackathon execution plan: [docs/hackathon-checklist.md](docs/hackathon-checklist.md)

## Core Highlights

- Hybrid cloud/local AI routing
- Personality-driven responses (sarcastic, friendly, professional, chaos)
- Voice-first interaction loop (STT, TTS, mic state)
- Adaptive short-term and long-term memory
- Real-time chat with streaming-ready architecture
- Privacy mode with offline-capable local inference

## UI Direction

The Venom interface follows a futuristic AI operating system style:

- Dark-mode first
- Glassmorphism panels
- Neon/cyan status accents
- Smooth Framer Motion transitions
- Voice-centric controls and live status signals

Reference style inspiration is documented in [docs/ui-direction.md](docs/ui-direction.md).

## Tech Stack

### Backend

- FastAPI
- Async modular architecture
- Provider abstraction for OpenRouter/Ollama
- Memory and voice pipeline modules

### Frontend

- Next.js App Router
- TailwindCSS
- Framer Motion
- Context + hook-based modular UI architecture

## Repository Structure

```text
venom/
├── backend/     # API, assistant brain, memory, voice, integrations
├── frontend/    # Next.js App Router interface
└── docs/        # Product, architecture, feature, and delivery docs
```

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:8000/health`

## Documentation

- [Architecture](docs/architecture.md)
- [Backend Guide](docs/backend.md)
- [Frontend Guide](docs/frontend.md)
- [API Reference](docs/api.md)
- [Feature List](docs/feature-list.md)
- [Hackathon Checklist](docs/hackathon-checklist.md)
- [UI Direction](docs/ui-direction.md)
- [Roadmap](docs/roadmap.md)
