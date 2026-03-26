// @resultsafe/core-fp-codec/src/constructors/createParser.ts

import type { Parser } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result-shared';

export const createParser = <T>(
  fn: (input: string) => Result<T, string>,
): Parser<T> => ({
  parse: fn,
});


