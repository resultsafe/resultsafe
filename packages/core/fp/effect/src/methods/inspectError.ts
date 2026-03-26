// @resultsafe/core-fp-effect/src/methods/inspectError.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import { inspectErr as resultInspectErr } from '@resultsafe/core-fp-result';

export const inspectError =
  <R, E, T>(effect: Effect<R, E, T>, fn: (error: E) => void): Effect<R, E, T> =>
  (context) =>
    effect(context).then((result) => resultInspectErr(result, fn));


