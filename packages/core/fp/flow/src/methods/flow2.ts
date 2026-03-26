// @resultsafe/core-fp-flow/src/methods/flow2.ts

import type { Flow } from '@resultsafe/core-fp-flow';

export const flow2 =
  <A, B, C>(ab: (a: A) => B, bc: (b: B) => C): Flow<A, C> =>
  (a) =>
    bc(ab(a));


