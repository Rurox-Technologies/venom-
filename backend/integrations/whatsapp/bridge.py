"""Python bridge between FastAPI backend and WhatsApp server."""


class WhatsAppBridge:
    """Maps WhatsApp webhook payloads to assistant requests."""

    async def handle_incoming(self, payload: dict) -> dict:
        # TODO: Validate payload and forward to chat pipeline.
        return {"status": "received"}
