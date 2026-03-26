// @resultsafe/core-fp-codec-zod/src/fromZod.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';
import * as z from 'zod';
import { withMeta } from './combinators/withMeta.js';
import {
  clearComponents,
  generateOpenApi,
  getComponents,
} from './openapi/generate/generate.js';
// ... остальные импорты ...

// Экспортируем утилиты components.schemas на верхний уровень
export { clearComponents, getComponents };

export const fromZod = <T>(
  schema: z.ZodType<T>,
  options?: { name?: string }, // ← имя для components.schemas
): Codec<T> => {
  const cached = getCachedCodec(schema);
  if (cached) return cached;

  let codec: Codec<T> = {
    decode: (input: unknown): Result<T, string> => {
      try {
        const parsed = schema.parse(input);
        return { ok: true, value: parsed };
      } catch (e: any) {
        return { ok: false, error: formatZodError(e) };
      }
    },
    encode: (value: T): unknown => value,
  };

  // Применяем комбинаторы
  codec = withMeta(codec, schema);
  codec = withEffects(codec, schema);
  codec = withRefinements(codec, schema);
  codec = withDefault(codec, schema);
  codec = withNullable(codec, schema);
  codec = withOptional(codec, schema);
  codec = withCatch(codec, schema);

  // Оборачиваем в Schema
  const meta = extractMeta(schema);
  const finalSchema = SchemaCtor(codec, meta);

  // 🔥 Генерируем OpenAPI и регистрируем в components.schemas, если указано имя
  if (options?.name) {
    generateOpenApi(finalSchema, { zodSchema: schema, name: options.name });
  }

  setCachedCodec(schema, codec);
  return codec;
};


