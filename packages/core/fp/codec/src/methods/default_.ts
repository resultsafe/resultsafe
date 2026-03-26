// @resultsafe/core-fp-codec/src/methods/default_.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const default_ = <T>(codec: Codec<T>, fallback: T): Codec<T> => ({
  decode: (input): Result<T, string> => {
    const result = codec.decode(input);
    return result.ok ? result : { ok: true, value: fallback };
  },
  encode: (t) => codec.encode(t),
});


