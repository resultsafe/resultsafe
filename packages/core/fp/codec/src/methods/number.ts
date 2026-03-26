// @resultsafe/core-fp-codec/src/methods/number.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const number = (): Codec<number> => ({
  decode: (input): Result<number, string> =>
    typeof input === 'number' && !isNaN(input)
      ? { ok: true, value: input }
      : { ok: false, error: 'Expected number' },
  encode: (n) => n,
});


