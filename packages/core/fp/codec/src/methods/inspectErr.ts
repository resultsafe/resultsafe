// @resultsafe/core-fp-codec/src/methods/inspectErr.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const inspectErr = <T>(
  codec: Codec<T>,
  f: (error: string) => void,
): Codec<T> => ({
  decode: (input): Result<T, string> => {
    const result = codec.decode(input);
    if (!result.ok) f(result.error);
    return result;
  },
  encode: (t) => codec.encode(t),
});


