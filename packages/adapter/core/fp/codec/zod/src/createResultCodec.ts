// packages/adapter/core/fp/codec-zod/src/codecs/result.ts
import { z } from 'zod';

export const createResultCodec = <T, E>(
  valueSchema: z.ZodSchema<T>,
  errorSchema: z.ZodSchema<E>,
) =>
  z.union([
    z.object({
      ok: z.literal(true),
      value: valueSchema,
    }),
    z.object({
      ok: z.literal(false),
      error: errorSchema,
    }),
  ]);

// Usage example:
// const userResultCodec = createResultCodec(
//   z.object({ id: z.number(), name: z.string() }),
//   z.object({ code: z.string(), message: z.string() })
// );
