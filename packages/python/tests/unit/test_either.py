from __future__ import annotations

from resultsafe.core.fp.either import (
    Either,
    Left,
    Right,
    and_then_either,
    left,
    map_either,
    map_left,
    right,
    swap,
    to_result,
)
from resultsafe.core.fp.result import Err, Ok


def test_either_map_paths() -> None:
    mapped_right: Either[str, int] = map_either(right(2), lambda value: value + 1)
    mapped_left: Either[str, int] = map_left(left("e"), lambda value: f"{value}!")

    assert isinstance(mapped_right, Right)
    assert mapped_right.value == 3
    assert isinstance(mapped_left, Left)
    assert mapped_left.value == "e!"


def test_either_and_swap_to_result() -> None:
    chained: Either[str, int] = and_then_either(right(3), lambda value: right(value * 4))
    swapped: Either[int, str] = swap(chained)

    assert isinstance(chained, Right)
    assert chained.value == 12
    assert isinstance(swapped, Left)
    assert swapped.value == 12

    assert isinstance(to_result(right(7)), Ok)
    assert isinstance(to_result(left("fail")), Err)
