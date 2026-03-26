// @resultsafe/core-fp-codec/src/methods/refineWith.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const refineWith = <T>(
  codec: Codec<T>,
  predicate: (t: T) => Result<T, string>,
): Codec<T> => ({
  decode: (input): Result<T, string> => {
    const result = codec.decode(input);
    if (!result.ok) return result;
    return predicate(result.value);
  },
  encode: (t) => codec.encode(t),
});


