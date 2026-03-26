// @resultsafe/core-fp-codec/src/constructors/createRefiner.ts

import type { Refiner } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result-shared';

export const createRefiner = <T>(
  fn: (input: T) => Result<T, string>,
): Refiner<T> => ({
  refine: fn,
});


