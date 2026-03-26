// @resultsafe/core-fp-effect/src/methods/orElse.ts

import type { Effect } from '@resultsafe/core-fp-effect';

export const orElse =
  <R, E, T, F>(
    effect: Effect<R, E, T>,
    fn: (error: E) => Effect<R, F, T>,
  ): Effect<R, F, T> =>
  (context) =>
    effect(context).then((result) =>
      result.ok ? result : fn(result.error)(context),
    );


