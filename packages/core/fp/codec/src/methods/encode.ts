// @resultsafe/core-fp-codec/src/methods/encode.ts

import type { Codec } from '@resultsafe/core-fp-codec';

export const encode = <T>(codec: Codec<T>, output: T): unknown =>
  codec.encode(output);


