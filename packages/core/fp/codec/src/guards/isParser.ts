// @resultsafe/core-fp-codec/src/guards/isParser.ts

import type { Parser } from '@resultsafe/core-fp-codec';

export const isParser = <T>(x: unknown): x is Parser<T> =>
  typeof x === 'object' && x !== null && 'parse' in x;


