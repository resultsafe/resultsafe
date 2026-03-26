// @resultsafe/core-fp-codec/src/methods/union.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const union = <T>(codecs: readonly Codec<T>[]): Codec<T> => {
  if (codecs.length === 0) {
    throw new Error('union: codecs array must not be empty');
  }

  return {
    decode: (input): Result<T, string> => {
      for (const codec of codecs) {
        const result = codec.decode(input);
        if (result.ok) return result;
      }
      return { ok: false, error: 'No codec in union succeeded' };
    },
    encode: (value) => codecs[0]!.encode(value),
  };
};


