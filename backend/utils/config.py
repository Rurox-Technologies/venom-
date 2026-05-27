"""Configuration loading from environment and defaults."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralized runtime configuration for Venom backend."""

    app_name: str = "Venom"
    environment: str = "development"
    openrouter_api_key: str = ""
    ollama_base_url: str = "http://localhost:11434"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
