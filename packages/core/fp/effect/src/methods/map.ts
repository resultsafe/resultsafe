// @resultsafe/core-fp-effect/src/methods/map.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import { map as resultMap } from '@resultsafe/core-fp-result';

export const map =
  <R, E, T, U>(effect: Effect<R, E, T>, fn: (value: T) => U): Effect<R, E, U> =>
  (context) =>
    effect(context).then((result) => resultMap(result, fn));


