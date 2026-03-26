// @resultsafe/core-fp-codec/src/guards/isRefiner.ts

import type { Refiner } from '@resultsafe/core-fp-codec';

export const isRefiner = <T>(x: unknown): x is Refiner<T> =>
  typeof x === 'object' && x !== null && 'refine' in x;


