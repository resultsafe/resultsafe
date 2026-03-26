// @resultsafe/core-fp-codec/src/methods/map.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const map = <T, U>(codec: Codec<T>, fn: (t: T) => U): Codec<U> => ({
  decode: (input): Result<U, string> => {
    const result = codec.decode(input);
    if (!result.ok) return result;
    return { ok: true, value: fn(result.value) };
  },
  encode: (u: U): unknown => {
    throw new Error('map: encode is not reversible — use imap or transform');
  },
});


