"""Application entrypoint for local development and production servers."""

from api.app import create_app

app = create_app()
