// @resultsafe/core-fp-codec/src/methods/omit.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const omit = <T, K extends keyof T>(
  codec: Codec<T>,
  keys: readonly K[],
): Codec<Omit<T, K>> => ({
  decode: (input): Result<Omit<T, K>, string> => {
    const result = codec.decode(input);
    if (!result.ok) return result;
    const omitted = { ...result.value };
    for (const key of keys) {
      delete omitted[key];
    }
    return { ok: true, value: omitted as Omit<T, K> };
  },
  encode: (omitted) => {
    throw new Error('omit: encode not reversible');
  },
});


