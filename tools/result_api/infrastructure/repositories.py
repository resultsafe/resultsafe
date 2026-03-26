from __future__ import annotations

from typing import Protocol, runtime_checkable

from tools.result_api.domain.result import Query


@runtime_checkable
class ResultRepository(Protocol):
    def get(self, query: Query):
        ...


class InMemoryResultRepository:
    def __init__(self):
        # Простое демо-хранилище; может быть заменено адаптером
        self._data = {
            "demo": {"message": "hello from result_api", "id": "demo"},
            "ping": {"message": "pong"},
        }

    def get(self, query: Query):
        return self._data.get(query.value)
