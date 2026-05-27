# API Reference (Starter)

Base URL (local): `http://localhost:8000`

## Health

- `GET /health`
- Response: `{ "status": "ok" }`

## Chat

- `POST /api/chat/message`
- Body:

```json
{
  "user_id": "user-001",
  "session_id": "session-001",
  "message": "Hello Venom",
  "language": "en",
  "mode": "balanced"
}
```

## Voice

- `POST /api/voice/transcribe`
- `POST /api/voice/speak`

## Memory

- `GET /api/memory/summary`

## Modes

- `GET /api/modes`

## Settings

- `GET /api/settings`

## Notes

Current endpoints are placeholders intended for integration in the next implementation phase.
