from __future__ import annotations

import asyncio
from typing import Any, Mapping

from resultsafe.core.fp.effect import Effect
from resultsafe.core.fp.result import Err, Ok, err, ok
from resultsafe.core.fp.task_result import TaskResult, from_async, from_result


async def _run_task_result_flow() -> None:
    base: TaskResult[int, str] = from_result(ok(4))
    mapped = base.map(lambda value: value + 1)
    chained = mapped.and_then(lambda value: from_result(ok(value * 2)))
    failed_base: TaskResult[int, str] = from_result(err("boom"))
    failed: TaskResult[int, str] = failed_base.or_else(lambda _: from_result(ok(99)))

    mapped_value = await mapped.run()
    chained_value = await chained.run()
    recovered_value = await failed.run()

    assert isinstance(mapped_value, Ok)
    assert mapped_value.value == 5
    assert isinstance(chained_value, Ok)
    assert chained_value.value == 10
    assert isinstance(recovered_value, Ok)
    assert recovered_value.value == 99


async def _run_task_result_from_async_error() -> None:
    async def _failing() -> int:
        raise ValueError("nope")

    task_result = from_async(_failing, lambda exc: str(exc))
    value = await task_result.run()

    assert isinstance(value, Err)
    assert value.error == "nope"


async def _run_effect_flow() -> None:
    async def _base_effect(context: Mapping[str, Any]) -> Ok[int] | Err[str]:
        value = context["value"]
        assert isinstance(value, int)
        return ok(value)

    effect = Effect(_base_effect)
    composed = effect.map(lambda value: value + 3).and_then(
        lambda value: Effect(lambda _ctx: _return_ok(value * 2))
    )

    value = await composed.run({"value": 4})
    assert isinstance(value, Ok)
    assert value.value == 14


async def _return_ok(value: int) -> Ok[int]:
    return ok(value)


def test_task_result_and_effect() -> None:
    asyncio.run(_run_task_result_flow())
    asyncio.run(_run_task_result_from_async_error())
    asyncio.run(_run_effect_flow())
