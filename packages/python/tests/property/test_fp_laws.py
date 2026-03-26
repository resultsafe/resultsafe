from __future__ import annotations

from hypothesis import given
from hypothesis import strategies as st

from resultsafe.core.fp.option import NONE, Option, map_option, some
from resultsafe.core.fp.result import Result, err, map_result, ok


@given(st.integers())
def test_result_map_identity_law(value: int) -> None:
    sample: Result[int, str] = ok(value)
    mapped = map_result(sample, lambda item: item)
    assert mapped == sample


@given(st.text())
def test_result_map_keeps_err_unchanged(error_value: str) -> None:
    sample: Result[int, str] = err(error_value)
    mapped = map_result(sample, lambda item: item + 1)
    assert mapped == sample


@given(st.integers())
def test_option_map_identity_law(value: int) -> None:
    sample: Option[int] = some(value)
    mapped = map_option(sample, lambda item: item)
    assert mapped == sample


def test_option_map_keeps_none_unchanged() -> None:
    sample: Option[int] = NONE
    mapped = map_option(sample, lambda item: item + 1)
    assert mapped == sample
