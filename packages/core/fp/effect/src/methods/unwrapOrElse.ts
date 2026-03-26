// @resultsafe/core-fp-effect/src/methods/unwrapOrElse.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import { unwrapOrElse as resultUnwrapOrElse } from '@resultsafe/core-fp-result';

export const unwrapOrElse = <R, E, T>(
  effect: Effect<R, E, T>,
  fn: (error: E) => T,
): Promise<T> =>
  effect(undefined as R).then((result) => resultUnwrapOrElse(result, fn));


