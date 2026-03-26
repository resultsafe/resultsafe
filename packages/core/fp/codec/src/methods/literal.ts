// @resultsafe/core-fp-codec/src/methods/literal.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const literal = <T extends string | number | boolean | null | undefined>(
  value: T,
): Codec<T> => ({
  decode: (input): Result<T, string> =>
    input === value
      ? { ok: true, value }
      : { ok: false, error: `Expected literal ${String(value)}` },
  encode: () => value,
});


