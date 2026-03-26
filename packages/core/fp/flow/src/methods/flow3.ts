// @resultsafe/core-fp-flow/src/methods/flow3.ts

import type { Flow } from '@resultsafe/core-fp-flow';

export const flow3 =
  <A, B, C, D>(ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): Flow<A, D> =>
  (a) =>
    cd(bc(ab(a)));


