"""Structured logging configuration."""

import json
import logging
import sys
from datetime import datetime, timezone


class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if record.exc_info and record.exc_info[0]:
            log_entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_entry)


_LOG_CONFIGURED = False


def get_logger(name: str, use_json: bool = True) -> logging.Logger:
    global _LOG_CONFIGURED
    if not _LOG_CONFIGURED:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(JSONFormatter() if use_json else logging.Formatter("%(asctime)s %(levelname)s %(name)s %(message)s"))
        root = logging.getLogger()
        root.setLevel(logging.INFO)
        root.handlers.clear()
        root.addHandler(handler)
        _LOG_CONFIGURED = True
    return logging.getLogger(name)
