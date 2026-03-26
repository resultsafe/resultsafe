// @resultsafe/core-fp-effect/src/methods/inspect.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import { inspect as resultInspect } from '@resultsafe/core-fp-result';

export const inspect =
  <R, E, T>(effect: Effect<R, E, T>, fn: (value: T) => void): Effect<R, E, T> =>
  (context) =>
    effect(context).then((result) => resultInspect(result, fn));


