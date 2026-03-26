// @resultsafe/core-fp-effect/src/constructors/fromResult.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import type { Result } from '@resultsafe/core-fp-result';

export const fromResult =
  <R, T, E>(result: Result<T, E>): Effect<R, E, T> =>
  () =>
    Promise.resolve(result);


