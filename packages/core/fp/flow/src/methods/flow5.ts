// @resultsafe/core-fp-flow/src/methods/flow5.ts

import type { Flow } from '@resultsafe/core-fp-flow';

export const flow5 =
  <A, B, C, D, E, F>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
  ): Flow<A, F> =>
  (a) =>
    ef(de(cd(bc(ab(a)))));


