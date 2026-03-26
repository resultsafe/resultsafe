// @resultsafe/core-fp-codec/src/constructors/createEncode.ts

import type { Encode } from '@resultsafe/core-fp-codec';

export const createEncode = <T>(fn: (output: T) => unknown): Encode<T> => ({
  encode: fn,
});


