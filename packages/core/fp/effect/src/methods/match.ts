// @resultsafe/core-fp-effect/src/methods/match.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import { ok, match as resultMatch } from '@resultsafe/core-fp-result';

export const match =
  <R, E, T, U>(
    effect: Effect<R, E, T>,
    handlers: {
      Ok: (value: T) => U;
      Err: (error: E) => U;
    },
  ): Effect<R, never, U> =>
  (context) =>
    effect(context).then((result) =>
      ok(resultMatch(result, handlers.Ok, handlers.Err)),
    );


