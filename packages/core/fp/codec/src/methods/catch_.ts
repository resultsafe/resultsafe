// @resultsafe/core-fp-codec/src/methods/catch_.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const catch_ = <T>(
  codec: Codec<T>,
  onError: (error: string) => Result<T, string>,
): Codec<T> => ({
  decode: (input): Result<T, string> => {
    const result = codec.decode(input);
    if (!result.ok) return onError(result.error);
    return result;
  },
  encode: (t) => codec.encode(t),
});


