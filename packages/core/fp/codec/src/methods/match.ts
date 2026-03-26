// @resultsafe/core-fp-codec/src/methods/match.ts

import type { Codec } from '@resultsafe/core-fp-codec';

export const match = <T, A>(
  codec: Codec<T>,
  handlers: { Ok: (value: T) => A; Err: (error: string) => A },
): ((input: unknown) => A) => {
  return (input) => {
    const result = codec.decode(input);
    return result.ok ? handlers.Ok(result.value) : handlers.Err(result.error);
  };
};


