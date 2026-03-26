// @resultsafe/core-fp-flow/src/methods/flow6.ts

import type { Flow } from '@resultsafe/core-fp-flow';

export const flow6 =
  <A, B, C, D, E, F, G>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
  ): Flow<A, G> =>
  (a) =>
    fg(ef(de(cd(bc(ab(a))))));


