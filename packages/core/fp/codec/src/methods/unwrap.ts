// @resultsafe/core-fp-codec/src/methods/unwrap.ts

import type { Codec } from '@resultsafe/core-fp-codec';

export const unwrap = <T>(codec: Codec<T>, input: unknown): T => {
  const result = codec.decode(input);
  if (!result.ok) throw new Error(result.error);
  return result.value;
};


