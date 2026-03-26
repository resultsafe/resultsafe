// @resultsafe/core-fp-codec/src/methods/optional.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const optional = <T>(codec: Codec<T>): Codec<T | undefined> => ({
  decode: (input): Result<T | undefined, string> =>
    input === undefined ? { ok: true, value: undefined } : codec.decode(input),
  encode: (output) => (output === undefined ? undefined : codec.encode(output)),
});


