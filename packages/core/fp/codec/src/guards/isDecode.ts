// @resultsafe/core-fp-codec/src/guards/isDecode.ts

import type { Decode } from '@resultsafe/core-fp-codec';

export const isDecode = <T>(x: unknown): x is Decode<T> =>
  typeof x === 'object' && x !== null && 'decode' in x;


