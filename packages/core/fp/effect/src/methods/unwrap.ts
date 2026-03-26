// @resultsafe/core-fp-effect/src/methods/unwrap.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import { unwrap as resultUnwrap } from '@resultsafe/core-fp-result';

export const unwrap = <R, E, T>(effect: Effect<R, E, T>): Promise<T> =>
  effect(undefined as R).then(resultUnwrap);


