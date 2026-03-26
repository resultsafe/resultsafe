// @resultsafe/core-fp-effect/src/methods/provideSome.ts

import type { Effect } from '@resultsafe/core-fp-effect';

export const provideSome =
  <R1, R2, E, T>(
    effect: Effect<R1 & R2, E, T>,
    context: R1,
  ): Effect<R2, E, T> =>
  (r2: R2) =>
    effect({ ...context, ...r2 });


