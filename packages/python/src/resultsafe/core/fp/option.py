from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Callable, Generic, TypeVar

T = TypeVar("T")
U = TypeVar("U")
E = TypeVar("E")

if TYPE_CHECKING:
    from resultsafe.core.fp.result import Result


class OptionUnwrapError(RuntimeError):
    """Исключение только для explicit unsafe-веток unwrap/expect."""


# DDD FP сущность наличия значения.
@dataclass(frozen=True)
class Some(Generic[T]):
    value: T


# DDD FP сущность отсутствия значения.
@dataclass(frozen=True)
class NoneOption:
    pass


NONE = NoneOption()
Option = Some[T] | NoneOption


def some(value: T) -> Some[T]:
    return Some(value=value)


def none() -> NoneOption:
    return NONE


def is_some(option: Option[T]) -> bool:
    return isinstance(option, Some)


def is_none(option: Option[T]) -> bool:
    return isinstance(option, NoneOption)


def map_option(option: Option[T], fn: Callable[[T], U]) -> Option[U]:
    if isinstance(option, Some):
        return some(fn(option.value))
    return option


def and_then_option(option: Option[T], fn: Callable[[T], Option[U]]) -> Option[U]:
    if isinstance(option, Some):
        return fn(option.value)
    return option


def or_else_option(option: Option[T], fn: Callable[[], Option[T]]) -> Option[T]:
    if isinstance(option, Some):
        return option
    return fn()


def inspect_option(option: Option[T], fn: Callable[[T], None]) -> Option[T]:
    if isinstance(option, Some):
        fn(option.value)
    return option


def expect(option: Option[T], message: str) -> T:
    if isinstance(option, Some):
        return option.value
    raise OptionUnwrapError(message)


def unwrap(option: Option[T]) -> T:
    return expect(option, "called unwrap on None")


def unwrap_or(option: Option[T], default: T) -> T:
    if isinstance(option, Some):
        return option.value
    return default


def unwrap_or_else(option: Option[T], fn: Callable[[], T]) -> T:
    if isinstance(option, Some):
        return option.value
    return fn()


def flatten(option: Option[Option[T]]) -> Option[T]:
    if isinstance(option, Some):
        return option.value
    return option


def transpose(option: Option["Result[T, E]"]) -> "Result[Option[T], E]":
    """Option[Result[T, E]] -> Result[Option[T], E] по аналогии с Rust."""

    from resultsafe.core.fp.result import Err, Ok, Result, err, ok

    if isinstance(option, Some):
        result_value: Result[T, E] = option.value
        if isinstance(result_value, Err):
            return err(result_value.error)
        if isinstance(result_value, Ok):
            return ok(some(result_value.value))

    return ok(NONE)
