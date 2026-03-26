// @resultsafe/core-fp-codec/src/methods/orElse.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const orElse = <T>(codec: Codec<T>, fallback: Codec<T>): Codec<T> => ({
  decode: (input): Result<T, string> => {
    const result = codec.decode(input);
    return result.ok ? result : fallback.decode(input);
  },
  encode: (t) => codec.encode(t),
});


