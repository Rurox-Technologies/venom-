"""Log rotation configuration for production logging."""

import logging
import os
from logging.handlers import RotatingFileHandler


LOG_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "logs")


def setup_file_logging(name: str = "venom", level: int = logging.INFO) -> logging.Logger:
    os.makedirs(LOG_DIR, exist_ok=True)
    logger = logging.getLogger(name)
    logger.setLevel(level)
    handler = RotatingFileHandler(
        os.path.join(LOG_DIR, f"{name}.log"),
        maxBytes=5 * 1024 * 1024,
        backupCount=3,
        encoding="utf-8",
    )
    handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(name)s %(message)s"))
    if not logger.handlers:
        logger.addHandler(handler)
    return logger
