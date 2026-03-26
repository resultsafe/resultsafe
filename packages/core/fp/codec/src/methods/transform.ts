// @resultsafe/core-fp-codec/src/methods/transform.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const transform = <T, U>(
  codec: Codec<T>,
  to: (t: T) => U,
  from: (u: U) => T,
): Codec<U> => ({
  decode: (input): Result<U, string> => {
    const result = codec.decode(input);
    if (!result.ok) return result;
    return { ok: true, value: to(result.value) };
  },
  encode: (u) => codec.encode(from(u)),
});


