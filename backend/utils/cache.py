"""Simple in-memory cache utility with TTL support."""

import time
from collections import OrderedDict


class TTLCache:
    """Thread-safe in-memory cache with time-based eviction."""

    def __init__(self, ttl_seconds: int = 300, maxsize: int = 256) -> None:
        self.ttl = ttl_seconds
        self.maxsize = maxsize
        self._store: OrderedDict[str, tuple[float, object]] = OrderedDict()

    def get(self, key: str) -> object | None:
        if key not in self._store:
            return None
        expiry, value = self._store[key]
        if time.time() > expiry:
            del self._store[key]
            return None
        self._store.move_to_end(key)
        return value

    def set(self, key: str, value: object) -> None:
        while len(self._store) >= self.maxsize:
            self._store.popitem(last=False)
        self._store[key] = (time.time() + self.ttl, value)

    def invalidate(self, key: str) -> None:
        self._store.pop(key, None)

    def clear(self) -> None:
        self._store.clear()
