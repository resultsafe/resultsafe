// @resultsafe/core-fp-codec/src/methods/refine.ts

import type { Refiner } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const refine = <T>(refiner: Refiner<T>, input: T): Result<T, string> =>
  refiner.refine(input);


