from __future__ import annotations

import asyncio
from dataclasses import dataclass
from typing import Awaitable, Callable, Generic, Iterable, TypeVar

T = TypeVar("T")
U = TypeVar("U")


# DDD FP сущность ленивой async-операции без скрытого выполнения.
@dataclass(frozen=True)
class Task(Generic[T]):
    _run: Callable[[], Awaitable[T]]

    async def run(self) -> T:
        return await self._run()

    def map(self, fn: Callable[[T], U]) -> "Task[U]":
        async def _mapped() -> U:
            value = await self.run()
            return fn(value)

        return Task(_mapped)

    def and_then(self, fn: Callable[[T], "Task[U]"]) -> "Task[U]":
        async def _chained() -> U:
            value = await self.run()
            next_task = fn(value)
            return await next_task.run()

        return Task(_chained)

    def with_timeout(self, timeout_seconds: float) -> "Task[T]":
        async def _with_timeout() -> T:
            return await asyncio.wait_for(self.run(), timeout=timeout_seconds)

        return Task(_with_timeout)


def from_value(value: T) -> Task[T]:
    async def _constant() -> T:
        return value

    return Task(_constant)


def from_awaitable(factory: Callable[[], Awaitable[T]]) -> Task[T]:
    return Task(factory)


def gather(tasks: Iterable[Task[T]]) -> Task[list[T]]:
    async def _gathered() -> list[T]:
        return [await task.run() for task in tasks]

    return Task(_gathered)


def race(tasks: Iterable[Task[T]]) -> Task[T]:
    async def _race() -> T:
        pending = [asyncio.create_task(task.run()) for task in tasks]
        if not pending:
            raise RuntimeError("race() requires at least one task")
        done, not_done = await asyncio.wait(pending, return_when=asyncio.FIRST_COMPLETED)
        for task in not_done:
            task.cancel()
        first = done.pop()
        return await first

    return Task(_race)
