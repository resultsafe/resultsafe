// @resultsafe/core-fp-codec/src/methods/lazy.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const lazy = <T>(mkCodec: () => Codec<T>): Codec<T> => {
  let cached: Codec<T> | null = null;
  return {
    decode: (input): Result<T, string> => {
      if (!cached) cached = mkCodec();
      return cached.decode(input);
    },
    encode: (output) => {
      if (!cached) cached = mkCodec();
      return cached.encode(output);
    },
  };
};


