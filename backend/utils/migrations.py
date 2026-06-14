"""Settings migration utilities for handling config format changes."""

import json
import os
import shutil

from utils.storage import get_data_dir


def migrate_settings() -> list[str]:
    applied = []
    settings_path = os.path.join(get_data_dir(), "settings.json")
    if not os.path.exists(settings_path):
        return applied
    with open(settings_path, encoding="utf-8") as f:
        settings = json.load(f)
    if "mode" in settings and "personality" not in settings:
        settings["personality"] = settings.pop("mode")
        applied.append("v1: renamed 'mode' to 'personality'")
    if "model" in settings:
        del settings["model"]
        applied.append("v2: removed deprecated 'model' field")
    backup_path = settings_path + ".bak"
    shutil.copy2(settings_path, backup_path)
    with open(settings_path, "w", encoding="utf-8") as f:
        json.dump(settings, f, indent=2)
    return applied
