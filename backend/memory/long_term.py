"""Long-term memory implementation for durable user context."""

import json
import os
from datetime import datetime, timezone


class LongTermMemory:
    """Persists important facts/preferences across sessions using file storage."""

    def __init__(self, storage_path: str | None = None) -> None:
        self.storage_path = storage_path or os.path.join(
            os.path.dirname(__file__), "..", "data", "long_term_memory.json"
        )
        self._ensure_file()

    def _ensure_file(self) -> None:
        os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)
        if not os.path.exists(self.storage_path):
            with open(self.storage_path, "w", encoding="utf-8") as f:
                json.dump({}, f)

    def _load(self) -> dict:
        with open(self.storage_path, encoding="utf-8") as f:
            return json.load(f)

    def _save(self, data: dict) -> None:
        with open(self.storage_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    async def upsert_fact(self, user_id: str, fact: str) -> None:
        data = self._load()
        if user_id not in data:
            data[user_id] = {"facts": [], "updated_at": ""}
        data[user_id]["facts"].append({"fact": fact, "created_at": datetime.now(timezone.utc).isoformat()})
        data[user_id]["updated_at"] = datetime.now(timezone.utc).isoformat()
        self._save(data)

    async def get_facts(self, user_id: str) -> list[dict]:
        data = self._load()
        return data.get(user_id, {}).get("facts", [])

    async def archive_old_facts(self, user_id: str, before_days: int = 30) -> int:
        data = self._load()
        if user_id not in data:
            return 0
        cutoff = datetime.now(timezone.utc).timestamp() - before_days * 86400
        remaining = []
        archived = 0
        for fact in data[user_id].get("facts", []):
            created = fact.get("created_at", "")
            try:
                dt = datetime.fromisoformat(created).timestamp()
            except (ValueError, TypeError):
                dt = 0
            if dt < cutoff:
                archived += 1
            else:
                remaining.append(fact)
        data[user_id]["facts"] = remaining
        data[user_id]["updated_at"] = datetime.now(timezone.utc).isoformat()
        self._save(data)
        return archived
