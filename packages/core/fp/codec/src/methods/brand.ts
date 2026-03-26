// @resultsafe/core-fp-codec/src/methods/brand.ts

import type { Branded, Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const brand = <T, B extends string>(
  codec: Codec<T>,
  _brand: B,
): Codec<Branded<T, B>> => ({
  decode: (input: unknown): Result<Branded<T, B>, string> => {
    const result = codec.decode(input);
    if (!result.ok) return result;
    return { ok: true, value: result.value as Branded<T, B> };
  },
  encode: (branded: Branded<T, B>): unknown => codec.encode(branded),
});


