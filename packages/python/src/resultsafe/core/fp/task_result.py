from __future__ import annotations

from dataclasses import dataclass
from typing import Awaitable, Callable, Generic, TypeVar

from resultsafe.core.fp.result import (
    Err,
    Result,
    err,
    inspect,
    inspect_err,
    map_err,
    map_result,
    ok,
)

T = TypeVar("T")
U = TypeVar("U")
E = TypeVar("E")
F = TypeVar("F")


# DDD FP сущность async-операции, возвращающей явный Result-контракт.
@dataclass(frozen=True)
class TaskResult(Generic[T, E]):
    _run: Callable[[], Awaitable[Result[T, E]]]

    async def run(self) -> Result[T, E]:
        return await self._run()

    def map(self, fn: Callable[[T], U]) -> "TaskResult[U, E]":
        async def _mapped() -> Result[U, E]:
            return map_result(await self.run(), fn)

        return TaskResult(_mapped)

    def map_err(self, fn: Callable[[E], F]) -> "TaskResult[T, F]":
        async def _mapped() -> Result[T, F]:
            return map_err(await self.run(), fn)

        return TaskResult(_mapped)

    def and_then(self, fn: Callable[[T], "TaskResult[U, E]"]) -> "TaskResult[U, E]":
        async def _chained() -> Result[U, E]:
            base_result = await self.run()
            if isinstance(base_result, Err):
                return err(base_result.error)
            next_task = fn(base_result.value)
            return await next_task.run()

        return TaskResult(_chained)

    def or_else(self, fn: Callable[[E], "TaskResult[T, F]"]) -> "TaskResult[T, F]":
        async def _or_else() -> Result[T, F]:
            base_result = await self.run()
            if isinstance(base_result, Err):
                next_task = fn(base_result.error)
                return await next_task.run()
            return ok(base_result.value)

        return TaskResult(_or_else)

    def inspect(self, fn: Callable[[T], None]) -> "TaskResult[T, E]":
        async def _inspect() -> Result[T, E]:
            return inspect(await self.run(), fn)

        return TaskResult(_inspect)

    def inspect_err(self, fn: Callable[[E], None]) -> "TaskResult[T, E]":
        async def _inspect_err() -> Result[T, E]:
            return inspect_err(await self.run(), fn)

        return TaskResult(_inspect_err)


def from_result(value: Result[T, E]) -> TaskResult[T, E]:
    async def _constant() -> Result[T, E]:
        return value

    return TaskResult(_constant)


def from_async(fn: Callable[[], Awaitable[T]], map_error: Callable[[Exception], E]) -> TaskResult[T, E]:
    async def _wrapped() -> Result[T, E]:
        try:
            return ok(await fn())
        except Exception as exc:  # noqa: BLE001
            return err(map_error(exc))

    return TaskResult(_wrapped)
