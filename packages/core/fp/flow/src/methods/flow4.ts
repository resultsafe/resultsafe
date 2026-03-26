// @resultsafe/core-fp-flow/src/methods/flow4.ts

import type { Flow } from '@resultsafe/core-fp-flow';

export const flow4 =
  <A, B, C, D, E>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
  ): Flow<A, E> =>
  (a) =>
    de(cd(bc(ab(a))));


