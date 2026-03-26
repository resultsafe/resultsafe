// @resultsafe/core-fp-codec/src/methods/decode.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const decode = <T>(codec: Codec<T>, input: unknown): Result<T, string> =>
  codec.decode(input);


