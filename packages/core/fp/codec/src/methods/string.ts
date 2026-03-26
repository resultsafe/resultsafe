// @resultsafe/core-fp-codec/src/methods/string.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const string = (): Codec<string> => ({
  decode: (input): Result<string, string> =>
    typeof input === 'string'
      ? { ok: true, value: input }
      : { ok: false, error: 'Expected string' },
  encode: (s) => s,
});


