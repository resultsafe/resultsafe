from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Generic, TypeVar, Union

T = TypeVar("T")
U = TypeVar("U")
E = TypeVar("E")
F = TypeVar("F")


# FP value-object успеха: неизменяемый контейнер полезного результата.
@dataclass(frozen=True)
class Ok(Generic[T]):
    value: T


# FP value-object ошибки: неизменяемый контейнер доменной/системной ошибки.
@dataclass(frozen=True)
class Err(Generic[E]):
    error: E


# Базовый Result-тип для функционального конвейера в application layer.
Result = Union[Ok[T], Err[E]]


def map_ok(result: Result[T, E], fn: Callable[[T], U]) -> Result[U, E]:
    if isinstance(result, Ok):
        return Ok(fn(result.value))
    return result


def map_err(result: Result[T, E], fn: Callable[[E], F]) -> Result[T, F]:
    if isinstance(result, Err):
        return Err(fn(result.error))
    return result


def bind(result: Result[T, E], fn: Callable[[T], Result[U, E]]) -> Result[U, E]:
    if isinstance(result, Ok):
        return fn(result.value)
    return result

