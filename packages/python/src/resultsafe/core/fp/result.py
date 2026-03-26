from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Callable, Generic, TypeVar

T = TypeVar("T")
U = TypeVar("U")
E = TypeVar("E")
F = TypeVar("F")

if TYPE_CHECKING:
    from resultsafe.core.fp.option import Option


class ResultUnwrapError(RuntimeError):
    """Исключение только для explicit unsafe-веток unwrap/expect."""


# DDD FP сущность успеха: неизменяемый контейнер доменного значения.
@dataclass(frozen=True)
class Ok(Generic[T]):
    value: T


# DDD FP сущность ошибки: неизменяемый контейнер ошибки/причины.
@dataclass(frozen=True)
class Err(Generic[E]):
    error: E


Result = Ok[T] | Err[E]


def ok(value: T) -> Ok[T]:
    return Ok(value=value)


def err(error: E) -> Err[E]:
    return Err(error=error)


def is_ok(result: Result[T, E]) -> bool:
    return isinstance(result, Ok)


def is_err(result: Result[T, E]) -> bool:
    return isinstance(result, Err)


def map_result(result: Result[T, E], fn: Callable[[T], U]) -> Result[U, E]:
    if isinstance(result, Ok):
        return ok(fn(result.value))
    return result


def map(result: Result[T, E], fn: Callable[[T], U]) -> Result[U, E]:
    return map_result(result, fn)


def map_err(result: Result[T, E], fn: Callable[[E], F]) -> Result[T, F]:
    if isinstance(result, Err):
        return err(fn(result.error))
    return result


def and_then(result: Result[T, E], fn: Callable[[T], Result[U, E]]) -> Result[U, E]:
    if isinstance(result, Ok):
        return fn(result.value)
    return result


def or_else(result: Result[T, E], fn: Callable[[E], Result[T, F]]) -> Result[T, F]:
    if isinstance(result, Err):
        return fn(result.error)
    return result


def inspect(result: Result[T, E], fn: Callable[[T], None]) -> Result[T, E]:
    if isinstance(result, Ok):
        fn(result.value)
    return result


def inspect_err(result: Result[T, E], fn: Callable[[E], None]) -> Result[T, E]:
    if isinstance(result, Err):
        fn(result.error)
    return result


def expect(result: Result[T, E], message: str) -> T:
    if isinstance(result, Ok):
        return result.value
    raise ResultUnwrapError(f"{message}: {result.error!r}")


def unwrap(result: Result[T, E]) -> T:
    return expect(result, "called unwrap on Err")


def unwrap_err(result: Result[T, E]) -> E:
    if isinstance(result, Err):
        return result.error
    raise ResultUnwrapError(f"called unwrap_err on Ok: {result.value!r}")


def expect_err(result: Result[T, E], message: str) -> E:
    if isinstance(result, Err):
        return result.error
    raise ResultUnwrapError(message)


def unwrap_or(result: Result[T, E], default: T) -> T:
    if isinstance(result, Ok):
        return result.value
    return default


def unwrap_or_else(result: Result[T, E], fn: Callable[[E], T]) -> T:
    if isinstance(result, Ok):
        return result.value
    return fn(result.error)


def flatten(result: Result[Result[T, E], E]) -> Result[T, E]:
    if isinstance(result, Ok):
        return result.value
    return result


def transpose(result: Result["Option[T]", E]) -> "Option[Result[T, E]]":
    """Result[Option[T], E] -> Option[Result[T, E]] по аналогии с Rust."""

    from resultsafe.core.fp.option import NONE, Some, some

    if isinstance(result, Err):
        return some(err(result.error))

    option_value = result.value
    if isinstance(option_value, Some):
        return some(ok(option_value.value))
    return NONE


def match(result: Result[T, E], ok_fn: Callable[[T], U], err_fn: Callable[[E], U]) -> U:
    if isinstance(result, Ok):
        return ok_fn(result.value)
    return err_fn(result.error)


def tap(result: Result[T, E], fn: Callable[[T], None]) -> Result[T, E]:
    if isinstance(result, Ok):
        fn(result.value)
    return result


def tap_err(result: Result[T, E], fn: Callable[[E], None]) -> Result[T, E]:
    if isinstance(result, Err):
        fn(result.error)
    return result
