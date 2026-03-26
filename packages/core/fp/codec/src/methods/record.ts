// @resultsafe/core-fp-codec/src/methods/record.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const record = <T>(codec: Codec<T>): Codec<Record<string, T>> => ({
  decode: (input): Result<Record<string, T>, string> => {
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
      return { ok: false, error: 'Expected object' };
    }
    const result: Record<string, T> = {};
    for (const key of Object.keys(input)) {
      const decoded = codec.decode((input as any)[key]);
      if (!decoded.ok) {
        return { ok: false, error: `At key "${key}": ${decoded.error}` };
      }
      result[key] = decoded.value;
    }
    return { ok: true, value: result };
  },
  encode: (obj) => {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (value !== undefined) {
        result[key] = codec.encode(value);
      }
    }
    return result;
  },
});


