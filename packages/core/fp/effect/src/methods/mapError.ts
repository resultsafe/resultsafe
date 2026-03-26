// @resultsafe/core-fp-effect/src/methods/mapError.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import { mapErr as resultMapErr } from '@resultsafe/core-fp-result';

export const mapError =
  <R, E, T, F>(effect: Effect<R, E, T>, fn: (error: E) => F): Effect<R, F, T> =>
  (context) =>
    effect(context).then((result) => resultMapErr(result, fn));


