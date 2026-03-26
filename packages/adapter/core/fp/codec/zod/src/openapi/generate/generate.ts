// @resultsafe/core-fp-codec-zod/src/openapi/generate.ts

import type { Schema } from '@resultsafe/core-fp-codec';
import { mergeWithZodOpenAPI } from '../../utils/withZodOpenAPI.js';
import type { OpenAPISchemaV3_1 } from '../types/v3_1.js';

// Глобальный реестр для components.schemas
const schemaRegistry = new Map<string, OpenAPISchemaV3_1>();

/**
 * Генерирует OpenAPI Schema Object из Codec/Schema
 * @param schema — fp-codec Schema
 * @param zodSchema — опционально, исходная Zod-схема для zod.openapi()
 * @param name — опционально, имя для components.schemas
 */
export const generateOpenApi = <T>(
  schema: Schema<T>,
  options?: {
    zodSchema?: z.ZodTypeAny;
    name?: string;
  },
): OpenAPISchemaV3_1 => {
  const meta = schema.meta || {};
  let openapi: OpenAPISchemaV3_1 = {
    description: meta.description,
    example: meta.examples?.[0],
    examples: meta.examples,
  };

  // 🔥 Интеграция с zod.openapi() — если передана Zod-схема
  if (options?.zodSchema) {
    openapi = mergeWithZodOpenAPI(openapi, options.zodSchema);
  }

  // Простейшая эвристика типов — можно расширить
  const test = schema.decode({});
  if (test.ok) {
    if (typeof test.value === 'string') openapi.type = 'string';
    if (typeof test.value === 'number') openapi.type = 'number';
    if (typeof test.value === 'boolean') openapi.type = 'boolean';
    if (Array.isArray(test.value)) {
      openapi.type = 'array';
      openapi.items = { type: 'string' };
    }
    if (
      typeof test.value === 'object' &&
      test.value !== null &&
      !Array.isArray(test.value)
    ) {
      openapi.type = 'object';
    }
  }

  // 🔥 Регистрация в components.schemas — если указано имя
  if (options?.name) {
    schemaRegistry.set(options.name, openapi);
  }

  return openapi;
};

/**
 * Генерирует components.schemas из реестра
 */
export const getComponents = () => {
  if (schemaRegistry.size === 0) return undefined;
  return {
    schemas: Object.fromEntries(schemaRegistry.entries()),
  };
};

/**
 * Очищает реестр — для тестов или изоляции
 */
export const clearComponents = () => {
  schemaRegistry.clear();
};


