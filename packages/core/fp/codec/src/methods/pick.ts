// @resultsafe/core-fp-codec/src/methods/pick.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const pick = <T, K extends keyof T>(
  codec: Codec<T>,
  keys: readonly K[],
): Codec<Pick<T, K>> => ({
  decode: (input): Result<Pick<T, K>, string> => {
    const result = codec.decode(input);
    if (!result.ok) return result;
    const picked = {} as Pick<T, K>;
    for (const key of keys) {
      picked[key] = result.value[key];
    }
    return { ok: true, value: picked };
  },
  encode: (picked) => {
    throw new Error('pick: encode not reversible');
  },
});


