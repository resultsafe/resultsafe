from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Callable, Generic, TypeVar

L = TypeVar("L")
R = TypeVar("R")
U = TypeVar("U")
V = TypeVar("V")

if TYPE_CHECKING:
    from resultsafe.core.fp.result import Result


# DDD FP сущность левой ветки (обычно ошибка/альтернатива).
@dataclass(frozen=True)
class Left(Generic[L]):
    value: L


# DDD FP сущность правой ветки (обычно успешное значение).
@dataclass(frozen=True)
class Right(Generic[R]):
    value: R


Either = Left[L] | Right[R]


def left(value: L) -> Left[L]:
    return Left(value=value)


def right(value: R) -> Right[R]:
    return Right(value=value)


def is_left(value: Either[L, R]) -> bool:
    return isinstance(value, Left)


def is_right(value: Either[L, R]) -> bool:
    return isinstance(value, Right)


def map_either(value: Either[L, R], fn: Callable[[R], U]) -> Either[L, U]:
    if isinstance(value, Right):
        return right(fn(value.value))
    return value


def map_left(value: Either[L, R], fn: Callable[[L], U]) -> Either[U, R]:
    if isinstance(value, Left):
        return left(fn(value.value))
    return value


def and_then_either(value: Either[L, R], fn: Callable[[R], Either[L, U]]) -> Either[L, U]:
    if isinstance(value, Right):
        return fn(value.value)
    return value


def or_else_either(value: Either[L, R], fn: Callable[[L], Either[U, R]]) -> Either[U, R]:
    if isinstance(value, Left):
        return fn(value.value)
    return value


def swap(value: Either[L, R]) -> Either[R, L]:
    if isinstance(value, Left):
        return right(value.value)
    return left(value.value)


def to_result(value: Either[L, R]) -> "Result[R, L]":
    from resultsafe.core.fp.result import err, ok

    if isinstance(value, Left):
        return err(value.value)
    return ok(value.value)
