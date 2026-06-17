"""Chat endpoint tests."""

from fastapi.testclient import TestClient


def test_send_message_returns_reply(client: TestClient) -> None:
    payload = {
        "user_id": "test_user",
        "session_id": "test_session",
        "message": "Hello Venom",
        "language": "en",
        "mode": "balanced",
    }
    response = client.post("/api/chat/message", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data


def test_send_message_invalid_payload(client: TestClient) -> None:
    response = client.post("/api/chat/message", json={"user_id": ""})
    assert response.status_code == 422
