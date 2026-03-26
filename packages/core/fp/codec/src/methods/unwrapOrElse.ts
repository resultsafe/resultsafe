// @resultsafe/core-fp-codec/src/methods/unwrapOrElse.ts

import type { Codec } from '@resultsafe/core-fp-codec';

export const unwrapOrElse = <T>(
  codec: Codec<T>,
  input: unknown,
  fallback: (error: string) => T,
): T => {
  const result = codec.decode(input);
  return result.ok ? result.value : fallback(result.error);
};


