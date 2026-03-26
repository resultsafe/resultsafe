// @resultsafe/core-fp-codec/src/methods/date.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const date = (): Codec<Date> => ({
  decode: (input): Result<Date, string> => {
    if (input instanceof Date && !isNaN(input.getTime())) {
      return { ok: true, value: input };
    }
    if (typeof input === 'string') {
      const d = new Date(input);
      if (!isNaN(d.getTime())) return { ok: true, value: d };
    }
    return { ok: false, error: 'Expected valid Date' };
  },
  encode: (d) => d.toISOString(),
});


