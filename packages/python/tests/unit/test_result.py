from __future__ import annotations

import pytest

from resultsafe.core.fp.option import NONE, Option, Some, some
from resultsafe.core.fp.result import (
    Err,
    Ok,
    Result,
    err,
    expect_err,
    flatten,
    is_err,
    is_ok,
    map,
    map_err,
    map_result,
    match,
    ok,
    or_else,
    tap,
    tap_err,
    transpose,
    unwrap,
    unwrap_or,
)


def test_result_ok_err_predicates() -> None:
    success = ok(10)
    failure = err("boom")

    assert isinstance(success, Ok)
    assert isinstance(failure, Err)
    assert is_ok(success)
    assert is_err(failure)


def test_result_map_and_or_else() -> None:
    success: Result[int, str] = map_result(ok(10), lambda value: value + 5)
    recovered: Result[int, str] = or_else(err("boom"), lambda error_value: ok(len(error_value)))

    assert unwrap(success) == 15
    assert unwrap(recovered) == 4


def test_result_map_err() -> None:
    mapped: Result[int, str] = map_err(err("boom"), lambda error_value: error_value.upper())

    assert isinstance(mapped, Err)
    assert mapped.error == "BOOM"


def test_result_unwrap_or() -> None:
    assert unwrap_or(ok(1), 99) == 1
    assert unwrap_or(err("x"), 99) == 99


def test_result_flatten_and_transpose() -> None:
    nested: Result[Result[int, str], str] = ok(ok(5))
    flattened: Result[int, str] = flatten(nested)
    result_some: Result[Option[int], str] = ok(some(7))
    result_none: Result[Option[int], str] = ok(NONE)
    result_err: Result[Option[int], str] = err("fail")

    transposed_some: Option[Result[int, str]] = transpose(result_some)
    transposed_none: Option[Result[int, str]] = transpose(result_none)
    transposed_err: Option[Result[int, str]] = transpose(result_err)

    assert isinstance(flattened, Ok)
    assert flattened.value == 5

    assert isinstance(transposed_some, Some)
    assert isinstance(transposed_some.value, Ok)
    assert transposed_some.value.value == 7
    assert transposed_none is NONE
    assert isinstance(transposed_err, Some)
    assert isinstance(transposed_err.value, Err)
    assert transposed_err.value.error == "fail"


def test_result_unwrap_raises() -> None:
    with pytest.raises(Exception):
        unwrap(err("failure"))


def test_result_map_alias_and_match_tap() -> None:
    doubled = map(ok(2), lambda value: value * 2)
    matched = match(
        err("boom"),
        lambda value: value,
        lambda error: f"error:{error}",
    )
    tapped_values: list[int] = []
    tapped_errors: list[str] = []

    tap(doubled, lambda value: tapped_values.append(value))
    tap_err(err("oops"), lambda error: tapped_errors.append(error))

    assert isinstance(doubled, Ok)
    assert doubled.value == 4
    assert matched == "error:boom"
    assert tapped_values == [4]
    assert tapped_errors == ["oops"]


def test_result_expect_err() -> None:
    failure = err("boom")

    assert expect_err(failure, "should not fail") == "boom"
    with pytest.raises(Exception):
        expect_err(ok(1), "unexpected success")
