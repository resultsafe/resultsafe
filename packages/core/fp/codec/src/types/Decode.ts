// @resultsafe/core-fp-codec/src/types/Decode.ts

import type { Result } from '@resultsafe/core-fp-result';

export type Decode<T> = {
  readonly decode: (input: unknown) => Result<T, string>;
};


