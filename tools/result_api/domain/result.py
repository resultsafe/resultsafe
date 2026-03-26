from __future__ import annotations

from dataclasses import dataclass
from typing import Generic, TypeVar, Union

T = TypeVar("T")


@dataclass(frozen=True)
class ErrorDetail:
    code: str
    message: str


@dataclass(frozen=True)
class Ok(Generic[T]):
    value: T


@dataclass(frozen=True)
class Err:
    error: ErrorDetail


Result = Union[Ok[T], Err]


def ok(value: T) -> Ok[T]:
    return Ok(value)


def err(code: str, message: str) -> Err:
    return Err(ErrorDetail(code=code, message=message))


class Query:
    """Value object for ID queries."""

    def __init__(self, raw_id: str):
        if raw_id is None:
            raise ValueError("invalid_id: id is required")
        normalized = str(raw_id).strip()
        if not normalized or any(c.isspace() for c in normalized):
            raise ValueError("invalid_id: id must be non-empty and without whitespace")
        self.value = normalized

    def __str__(self) -> str:
        return self.value


def result_to_dict(result: Result[T]) -> dict:
    if isinstance(result, Ok):
        return {"ok": True, "value": result.value}
    if isinstance(result, Err):
        return {"ok": False, "error": {"code": result.error.code, "message": result.error.message}}
    raise TypeError("Unsupported result type")
