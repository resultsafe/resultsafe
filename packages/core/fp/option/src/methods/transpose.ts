import { type Option } from '@resultsafe/core-fp-option-shared';
import { type Result } from '@resultsafe/core-fp-result-shared';
import { None, Some } from '../constructors/index.js';

export const transpose = <T, E>(
  option: Option<Result<T, E>>,
): Result<Option<T>, E> => {
  if (option.some === true) {
    const res = option.value;
    return res.ok
      ? { ok: true, value: Some(res.value) }
      : { ok: false, error: res.error };
  }
  return { ok: true, value: None };
};


