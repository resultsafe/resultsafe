from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Awaitable, Callable, Generic, Mapping, TypeVar

from resultsafe.core.fp.result import Err, Result, err, map_result

T = TypeVar("T")
U = TypeVar("U")
E = TypeVar("E")

EffectContext = Mapping[str, Any]


# DDD FP сущность эффекта: вычисление с явным контекстом и Result-выходом.
@dataclass(frozen=True)
class Effect(Generic[T, E]):
    _run: Callable[[EffectContext], Awaitable[Result[T, E]]]

    async def run(self, context: EffectContext) -> Result[T, E]:
        return await self._run(context)

    def map(self, fn: Callable[[T], U]) -> "Effect[U, E]":
        async def _mapped(context: EffectContext) -> Result[U, E]:
            return map_result(await self.run(context), fn)

        return Effect(_mapped)

    def and_then(self, fn: Callable[[T], "Effect[U, E]"]) -> "Effect[U, E]":
        async def _chained(context: EffectContext) -> Result[U, E]:
            base_result = await self.run(context)
            if isinstance(base_result, Err):
                return err(base_result.error)
            next_effect = fn(base_result.value)
            return await next_effect.run(context)

        return Effect(_chained)

    def provide(self, context: EffectContext) -> Callable[[], Awaitable[Result[T, E]]]:
        async def _provided() -> Result[T, E]:
            return await self.run(context)

        return _provided

    def provide_some(self, extra_context: EffectContext) -> "Effect[T, E]":
        async def _provided(context: EffectContext) -> Result[T, E]:
            merged = dict(context)
            merged.update(extra_context)
            return await self.run(merged)

        return Effect(_provided)
