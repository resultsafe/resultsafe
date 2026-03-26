// @resultsafe/core-fp-codec/src/methods/parse.ts

import type { Parser } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const parse = <T>(parser: Parser<T>, input: string): Result<T, string> =>
  parser.parse(input);


