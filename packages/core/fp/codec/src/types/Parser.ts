// @resultsafe/core-fp-codec/src/types/Parser.ts

import type { Result } from '@resultsafe/core-fp-result';

export type Parser<T> = {
  readonly parse: (input: string) => Result<T, string>;
};


