// @resultsafe/core-fp-codec/src/methods/struct.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const struct = <T extends Record<string, Codec<any>>>(
  fields: T,
): Codec<{ [K in keyof T]: T[K] extends Codec<infer U> ? U : never }> => ({
  decode: (
    input,
  ): Result<
    { [K in keyof T]: T[K] extends Codec<infer U> ? U : never },
    string
  > => {
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
      return { ok: false, error: 'Expected object' };
    }
    const result = {} as any;
    for (const key of Object.keys(fields) as (keyof T)[]) {
      const fieldCodec = fields[key];
      if (!fieldCodec) {
        return {
          ok: false,
          error: `Field codec for "${String(key)}" is undefined`,
        };
      }
      const decoded = fieldCodec.decode((input as any)[key]);
      if (!decoded.ok) {
        return {
          ok: false,
          error: `At field "${String(key)}": ${decoded.error}`,
        };
      }
      result[key] = decoded.value;
    }
    return { ok: true, value: result };
  },
  encode: (obj) => {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(fields) as (keyof T)[]) {
      const fieldCodec = fields[key];
      if (fieldCodec) {
        result[String(key)] = fieldCodec.encode(obj[key]);
      }
    }
    return result;
  },
});


