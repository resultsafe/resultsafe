// @resultsafe/core-fp-flow/src/constructors/flow.ts

import type { Flow } from '@resultsafe/core-fp-flow';

export const flow = <A, B>(ab: (a: A) => B): Flow<A, B> => ab;


