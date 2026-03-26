// @resultsafe/core-fp-codec/src/methods/validate.ts

import type { Codec } from '@resultsafe/core-fp-codec';

export const validate = <T>(codec: Codec<T>, input: unknown): boolean => {
  const result = codec.decode(input);
  return result.ok;
};


