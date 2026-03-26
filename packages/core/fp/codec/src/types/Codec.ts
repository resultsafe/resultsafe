// @resultsafe/core-fp-codec/src/types/Codec.ts

import type { Result } from '@resultsafe/core-fp-result';

export type Codec<T> = {
  readonly decode: (input: unknown) => Result<T, string>;
  readonly encode: (output: T) => unknown;
};


