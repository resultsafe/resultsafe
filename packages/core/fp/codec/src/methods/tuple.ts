// @resultsafe/core-fp-codec/src/methods/tuple.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const tuple = <T extends readonly Codec<any>[]>(
  ...codecs: T
): Codec<{ [K in keyof T]: T[K] extends Codec<infer U> ? U : never }> => ({
  decode: (
    input,
  ): Result<
    { [K in keyof T]: T[K] extends Codec<infer U> ? U : never },
    string
  > => {
    if (!Array.isArray(input) || input.length !== codecs.length) {
      return {
        ok: false,
        error: `Expected tuple of length ${codecs.length}`,
      };
    }
    const result = [] as any[];
    for (let i = 0; i < codecs.length; i++) {
      const codec = codecs[i];
      if (!codec) {
        return { ok: false, error: `Codec at index ${i} is undefined` };
      }
      const decoded = codec.decode(input[i]);
      if (!decoded.ok) {
        return { ok: false, error: `At index ${i}: ${decoded.error}` };
      }
      result[i] = decoded.value;
    }
    return { ok: true, value: result as any };
  },
  encode: (tuple) =>
    tuple.map((val, i) => {
      const codec = codecs[i];
      if (!codec) {
        throw new Error(`Codec at index ${i} is undefined`);
      }
      return codec.encode(val);
    }),
});


