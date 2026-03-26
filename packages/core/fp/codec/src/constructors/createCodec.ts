// @resultsafe/core-fp-codec/src/constructors/createCodec.ts
import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result-shared';

export const createCodec = <T>(
  decode: (input: unknown) => Result<T, string>,
  encode: (output: T) => unknown,
): Codec<T> => ({
  decode,
  encode,
});


