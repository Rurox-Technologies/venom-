# Backend Guide

## Stack

- FastAPI
- Pydantic / pydantic-settings
- Async-first module design

## Run Locally

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Important Entry Points

- `main.py`: FastAPI app export
- `api/app.py`: router composition
- `models/request_models.py`: request schema definitions
- `utils/config.py`: environment-backed settings

## Available Starter Routes

- `POST /api/chat/message`
- `POST /api/voice/transcribe`
- `POST /api/voice/speak`
- `GET /api/memory/summary`
- `GET /api/modes`
- `GET /api/settings`
- `GET /health`

## Next Backend Steps

- Implement provider SDK calls in OpenRouter/Ollama modules
- Add persistent DB/vector storage for long-term memory
- Add auth/rate limiting and structured observability
- Add tests (`pytest`, `httpx`, route/unit coverage)
