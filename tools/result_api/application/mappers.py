from __future__ import annotations

from tools.result_api.domain.result import Result, result_to_dict


def to_dict(result: Result) -> dict:
    return result_to_dict(result)
