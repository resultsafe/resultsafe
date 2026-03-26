// @resultsafe/core-fp-do/src/methods/andThen.ts

import type { Do } from '@resultsafe/core-fp-do';
import type { Result } from '@resultsafe/core-fp-result-shared';

export const andThen = <T, U>(
  _do: Do<T>,
  fn: (value: T) => Result<U, string>,
): Result<U, string> => fn(_do.value);


