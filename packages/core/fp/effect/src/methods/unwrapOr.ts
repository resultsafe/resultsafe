// @resultsafe/core-fp-effect/src/methods/unwrapOr.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import { unwrapOr as resultUnwrapOr } from '@resultsafe/core-fp-result';

export const unwrapOr = <R, E, T>(
  effect: Effect<R, E, T>,
  defaultValue: T,
): Promise<T> =>
  effect(undefined as R).then((result) => resultUnwrapOr(result, defaultValue));


