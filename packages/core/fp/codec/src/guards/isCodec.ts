// @resultsafe/core-fp-codec/src/guards/isCodec.ts

import type { Codec } from '@resultsafe/core-fp-codec';

export const isCodec = <T>(x: unknown): x is Codec<T> =>
  typeof x === 'object' && x !== null && 'decode' in x && 'encode' in x;


