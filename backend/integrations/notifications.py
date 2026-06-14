"""Notification service for pushing alerts and system messages."""

import logging
from typing import Protocol

logger = logging.getLogger(__name__)


class NotificationBackend(Protocol):
    def send(self, title: str, body: str, level: str = "info") -> None: ...


class ConsoleNotifier:
    def send(self, title: str, body: str, level: str = "info") -> None:
        logger.info("[%s] %s: %s", level.upper(), title, body)


class NotificationService:
    def __init__(self) -> None:
        self._backends: list[NotificationBackend] = [ConsoleNotifier()]

    def register_backend(self, backend: NotificationBackend) -> None:
        self._backends.append(backend)

    def notify(self, title: str, body: str, level: str = "info") -> None:
        for backend in self._backends:
            try:
                backend.send(title, body, level)
            except Exception as e:
                logger.error("Notification backend failed: %s", e)


notifier = NotificationService()
