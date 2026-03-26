from __future__ import annotations

from abc import ABC, abstractmethod

from .result import Result, Query


class ResultService(ABC):
    """Domain service contract for fetching data by Query."""

    @abstractmethod
    def fetch(self, query: Query) -> Result:
        ...
