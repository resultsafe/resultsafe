from __future__ import annotations

import traceback
from typing import Optional

from tools.result_api.domain import Err, Query, Result, ok, err, result_to_dict
from tools.result_api.domain.services import ResultService
from tools.result_api.infrastructure.repositories import InMemoryResultRepository, ResultRepository
from tools.result_api.infrastructure.logging import log_internal_error


class DefaultResultService(ResultService):
    def __init__(self, repository: ResultRepository):
        self.repository = repository

    def fetch(self, query: Query) -> Result:
        data = self.repository.get(query)
        if data is None:
            return err("not_found", f"id '{query.value}' not found")
        return ok(data)


def handle_request(raw_id: str, service: Optional[ResultService] = None) -> dict:
    try:
        query = Query(raw_id)
    except ValueError as exc:
        return result_to_dict(err("invalid_id", str(exc)))

    service = service or DefaultResultService(InMemoryResultRepository())

    try:
        result = service.fetch(query)
        return result_to_dict(result)
    except Exception as exc:  # noqa: BLE001
        log_internal_error(exc, traceback.format_exc())
        return result_to_dict(err("internal", "internal error"))
