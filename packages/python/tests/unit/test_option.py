from __future__ import annotations

import pytest

from resultsafe.core.fp.option import (
    NONE,
    Option,
    Some,
    and_then_option,
    flatten,
    is_none,
    is_some,
    map_option,
    some,
    transpose,
    unwrap,
    unwrap_or,
)
from resultsafe.core.fp.result import Err, Ok, Result


def test_option_predicates() -> None:
    assert is_some(some(1))
    assert is_none(NONE)


def test_option_map_and_then() -> None:
    mapped = map_option(some(3), lambda value: value + 2)
    chained = and_then_option(some(3), lambda value: some(value * 3))

    assert isinstance(mapped, Some)
    assert mapped.value == 5
    assert unwrap(chained) == 9


def test_option_flatten_and_transpose() -> None:
    nested: Option[Option[int]] = some(some(5))
    flattened = flatten(nested)
    option_ok: Option[Result[int, str]] = some(Ok(8))
    option_err: Option[Result[int, str]] = some(Err("boom"))
    option_none: Option[Result[int, str]] = NONE

    transposed_ok: Result[Option[int], str] = transpose(option_ok)
    transposed_err: Result[Option[int], str] = transpose(option_err)
    transposed_none: Result[Option[int], str] = transpose(option_none)

    assert unwrap(flattened) == 5
    assert isinstance(transposed_ok, Ok)
    assert unwrap(transposed_ok.value) == 8
    assert isinstance(transposed_err, Err)
    assert transposed_err.error == "boom"
    assert isinstance(transposed_none, Ok)
    assert transposed_none.value is NONE


def test_option_unwrap_or() -> None:
    assert unwrap_or(some("x"), "fallback") == "x"
    assert unwrap_or(NONE, "fallback") == "fallback"


def test_option_unwrap_raises() -> None:
    with pytest.raises(Exception):
        unwrap(NONE)
