// @resultsafe/core-fp-codec/src/methods/array.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const array = <T>(codec: Codec<T>): Codec<T[]> => ({
  decode: (input): Result<T[], string> => {
    if (!Array.isArray(input)) {
      return { ok: false, error: 'Expected array' };
    }
    const results: T[] = [];
    for (let i = 0; i < input.length; i++) {
      const result = codec.decode(input[i]);
      if (!result.ok) {
        return { ok: false, error: `At index ${i}: ${result.error}` };
      }
      results.push(result.value);
    }
    return { ok: true, value: results };
  },
  encode: (arr) => arr.map(codec.encode),
});


