// @resultsafe/core-fp-codec/src/guards/isEncode.ts

import type { Encode } from '@resultsafe/core-fp-codec';

export const isEncode = <T>(x: unknown): x is Encode<T> =>
  typeof x === 'object' && x !== null && 'encode' in x;


