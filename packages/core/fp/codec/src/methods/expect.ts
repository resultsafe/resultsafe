// @resultsafe/core-fp-codec/src/methods/expect.ts

import type { Codec } from '@resultsafe/core-fp-codec';

export const expect = <T>(codec: Codec<T>, input: unknown, msg: string): T => {
  const result = codec.decode(input);
  if (!result.ok) throw new Error(`${msg}: ${result.error}`);
  return result.value;
};


