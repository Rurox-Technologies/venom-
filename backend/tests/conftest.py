"""Pytest fixtures for Venom backend tests."""

import pytest
from fastapi.testclient import TestClient

from api.app import create_app


@pytest.fixture
def client():
    """Return a TestClient for the Venom FastAPI application."""
    app = create_app()
    with TestClient(app) as c:
        yield c
