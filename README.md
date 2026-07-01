# Venom

![Python](https://img.shields.io/badge/python-3.12-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)
![License](https://img.shields.io/badge/license-MIT-purple.svg)

**Venom** is a hybrid personality-driven AI assistant that combines cloud intelligence (OpenRouter) with privacy-first local inference (Ollama). It features voice interaction, adaptive memory, multilingual communication, and a futuristic AI operating system interface.

## Features

- Hybrid cloud/local AI routing with automatic fallback
- Personality-driven responses (sarcastic, friendly, professional, chaos)
- Voice-first interaction loop (STT, TTS, wake word)
- Adaptive short-term and long-term memory
- Real-time chat with WebSocket and SSE streaming
- Privacy mode with offline-capable local inference
- Multilingual support (English, Hindi, Spanish, French, German)
- Rate limiting, caching, and performance monitoring
- File uploads, conversation search, and export

## Tech Stack

### Backend
- **FastAPI** — async Python web framework
- **Pydantic** — data validation and settings
- **SQLite** — persistent storage
- **httpx** — async HTTP client for AI providers

### Frontend
- **Next.js 15** (App Router) — React framework
- **Tailwind CSS 4** — utility-first styling
- **Framer Motion** — animations
- **TypeScript** — type safety

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Configure your API keys
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:8000/health`
- API docs: `http://localhost:8000/docs`

## Project Structure

```
venom/
├── backend/            # FastAPI backend
│   ├── api/            # Routes and middleware
│   ├── brain/          # AI orchestration, routing, personality
│   ├── memory/         # Short-term and long-term memory
│   ├── voice/          # STT, TTS, wake word pipeline
│   ├── integrations/   # WhatsApp bridge, notifications
│   ├── models/         # Pydantic schemas
│   ├── utils/          # Config, logging, helpers
│   ├── tests/          # Pytest suite
│   └── data/           # Persistent storage
├── frontend/           # Next.js application
│   └── src/
│       ├── app/        # App Router pages
│       ├── components/ # React components
│       ├── context/    # State management
│       ├── hooks/      # Custom React hooks
│       └── lib/        # Utilities and API client
├── docs/               # Documentation
├── Dockerfile
├── docker-compose.yml
├── LICENSE
└── CONTRIBUTING.md
```

## API Overview

| Endpoint | Description |
|----------|-------------|
| `POST /api/chat/message` | Send a chat message |
| `GET /api/conversations` | List conversations |
| `POST /api/voice/transcribe` | Speech-to-text |
| `POST /api/voice/speak` | Text-to-speech |
| `GET /api/memory/summary` | Get memory summary |
| `GET /api/search/messages` | Search messages |
| `GET /api/metrics/stats` | System metrics |
| `GET /health` | Health check |
| `WS /ws/chat/{session_id}` | Real-time chat |

## Documentation

- [Architecture](docs/architecture.md)
- [Backend Guide](docs/backend.md)
- [Frontend Guide](docs/frontend.md)
- [API Reference](docs/api.md)
- [Feature List](docs/feature-list.md)
- [Roadmap](docs/roadmap.md)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Support

- GitHub Issues: [Report a bug](https://github.com/Rurox-Technologies/venom-/issues)
- Security: See [SECURITY.md](SECURITY.md)
- Star the repo if you find this project useful!
