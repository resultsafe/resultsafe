// @resultsafe/core-fp-codec/src/methods/intersection.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const intersection = <T>(codecs: readonly Codec<T>[]): Codec<T> => {
  if (codecs.length === 0) {
    throw new Error('intersection: codecs array must not be empty');
  }

  return {
    decode: (input): Result<T, string> => {
      let value: T = input as any;
      for (const codec of codecs) {
        const result = codec.decode(value);
        if (!result.ok) return result;
        value = result.value;
      }
      return { ok: true, value };
    },
    encode: (value) => codecs[0]!.encode(value),
  };
};


