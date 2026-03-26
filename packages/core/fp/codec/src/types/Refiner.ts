// @resultsafe/core-fp-codec/src/types/Refiner.ts

import type { Result } from '@resultsafe/core-fp-result';

export type Refiner<T> = {
  readonly refine: (input: T) => Result<T, string>;
};


