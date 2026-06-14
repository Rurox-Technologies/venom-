"""Application-wide constants and enums."""

from enum import Enum

DEFAULT_LANGUAGE = "en"
SUPPORTED_LANGUAGES = ["en", "hi", "es", "fr", "de"]
DEFAULT_MODE = "balanced"
SUPPORTED_MODES = ["balanced", "creative", "concise"]
MAX_MESSAGE_LENGTH = 4096
MAX_SESSION_ID_LENGTH = 128
MAX_USER_ID_LENGTH = 64


class ModeEnum(str, Enum):
    BALANCED = "balanced"
    CREATIVE = "creative"
    CONCISE = "concise"


class LanguageEnum(str, Enum):
    EN = "en"
    HI = "hi"
    ES = "es"
    FR = "fr"
    DE = "de"
