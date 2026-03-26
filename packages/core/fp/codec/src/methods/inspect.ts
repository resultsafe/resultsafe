// @resultsafe/core-fp-codec/src/methods/inspect.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const inspect = <T>(
  codec: Codec<T>,
  f: (value: T) => void,
): Codec<T> => ({
  decode: (input): Result<T, string> => {
    const result = codec.decode(input);
    if (result.ok) f(result.value);
    return result;
  },
  encode: (t) => {
    f(t);
    return codec.encode(t);
  },
});


