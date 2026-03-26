// @resultsafe/core-fp-do/src/methods/map.ts

import type { Do } from '@resultsafe/core-fp-do';
import type { Result } from '@resultsafe/core-fp-result';

export const map = <T, U>(
  _do: Do<T>,
  fn: (value: T) => U,
): Result<U, string> => ({ ok: true, value: fn(_do.value) });


