// @resultsafe/core-fp-codec/src/methods/nullable.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const nullable = <T>(codec: Codec<T>): Codec<T | null> => ({
  decode: (input): Result<T | null, string> =>
    input === null ? { ok: true, value: null } : codec.decode(input),
  encode: (output) => (output === null ? null : codec.encode(output)),
});


