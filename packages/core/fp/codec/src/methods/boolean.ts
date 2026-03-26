// @resultsafe/core-fp-codec/src/methods/boolean.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const boolean = (): Codec<boolean> => ({
  decode: (input): Result<boolean, string> =>
    typeof input === 'boolean'
      ? { ok: true, value: input }
      : { ok: false, error: 'Expected boolean' },
  encode: (b) => b,
});


