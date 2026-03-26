// @resultsafe/core-fp-codec/src/methods/compose.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const compose = <B, C>(ab: Codec<B>, bc: Codec<C>): Codec<C> => ({
  decode: (input): Result<C, string> => {
    const abResult = ab.decode(input);
    if (!abResult.ok) return abResult;
    return bc.decode(abResult.value);
  },
  encode: (c: C): unknown => {
    const encoded = bc.encode(c);
    return ab.encode(encoded as B);
  },
});


