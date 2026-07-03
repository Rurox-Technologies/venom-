"""Configuration loading from environment and defaults with validation."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralized runtime configuration for Venom backend."""

    app_name: str = "Venom"
    environment: str = "development"
    openrouter_api_key: str = ""
    openai_api_key: str = ""
    ollama_base_url: str = "http://localhost:11434"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    rate_limit_max: int = 60
    rate_limit_window: int = 60
    log_level: str = "INFO"
    stt_provider: str = "whisper"
    tts_provider: str = "openai"
    tts_voice: str = "alloy"
    wake_word_enabled: bool = False
    audio_max_size_mb: int = 25

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    def validate_environment(self) -> list[str]:
        warnings: list[str] = []
        if self.environment == "production" and not self.openrouter_api_key:
            warnings.append("OPENROUTER_API_KEY is not set in production mode")
        if self.log_level.upper() not in ("DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"):
            warnings.append(f"Invalid log_level: {self.log_level}")
        return warnings


settings = Settings()
