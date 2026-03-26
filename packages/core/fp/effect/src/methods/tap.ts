// @resultsafe/core-fp-effect/src/methods/tap.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import { tap as resultTap } from '@resultsafe/core-fp-result';

export const tap =
  <R, E, T>(effect: Effect<R, E, T>, fn: (value: T) => void): Effect<R, E, T> =>
  (context: R) =>
    effect(context).then((result) => resultTap(result, fn));


