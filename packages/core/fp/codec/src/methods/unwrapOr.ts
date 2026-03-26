// @resultsafe/core-fp-codec/src/methods/unwrapOr.ts

import type { Codec } from '@resultsafe/core-fp-codec';

export const unwrapOr = <T>(
  codec: Codec<T>,
  input: unknown,
  defaultValue: T,
): T => {
  const result = codec.decode(input);
  return result.ok ? result.value : defaultValue;
};


