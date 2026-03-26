// @resultsafe/core-fp-codec-zod/src/utils/typeToOpenApi.ts

import type { Schema } from '@resultsafe/core-fp-codec';
import type { OpenAPISchema } from '../openapi/types.js';

const isObject = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x);

/**
 * Рекурсивно преобразует Schema<T> в OpenAPISchema с поддержкой:
 * - Вложенных объектов
 * - Массивов
 * - Примитивов
 * - contentMediaType, contentEncoding, xml, externalDocs (если переданы через meta)
 */
export const typeToOpenApi = <T>(schema: Schema<T>): OpenAPISchema => {
  const meta = schema.meta || {};
  let openapi: OpenAPISchema = {
    description: meta.description,
    example: meta.examples?.[0],
    examples: meta.examples,
  };

  const test = schema.decode({});
  if (!test.ok) return openapi;

  const value = test.value;

  if (typeof value === 'string') {
    openapi.type = 'string';
  } else if (typeof value === 'number') {
    openapi.type = 'number';
  } else if (typeof value === 'boolean') {
    openapi.type = 'boolean';
  } else if (Array.isArray(value)) {
    openapi.type = 'array';
    if (value.length > 0) {
      // Рекурсивно обрабатываем первый элемент массива
      const itemSchema = {
        decode: () => ({ ok: true, value: value[0] }),
        encode: (v: unknown) => v,
        meta: undefined,
      } as Schema<unknown>;
      openapi.items = typeToOpenApi(itemSchema);
    } else {
      openapi.items = { type: 'string' }; // fallback
    }
  } else if (isObject(value)) {
    openapi.type = 'object';
    openapi.properties = {};
    openapi.required = [];

    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const itemSchema = {
          decode: () => ({ ok: true, value: value[key] }),
          encode: (v: unknown) => v,
          meta: undefined,
        } as Schema<unknown>;

        openapi.properties[key] = typeToOpenApi(itemSchema);
        openapi.required.push(key);
      }
    }
  }

  // Добавляем специальные поля из meta, если они есть
  if (meta.openapi) {
    const openapiMeta = meta.openapi as Partial<OpenAPISchema>;
    if (openapiMeta.contentMediaType)
      openapi.contentMediaType = openapiMeta.contentMediaType;
    if (openapiMeta.contentEncoding)
      openapi.contentEncoding = openapiMeta.contentEncoding;
    if (openapiMeta.xml) openapi.xml = openapiMeta.xml;
    if (openapiMeta.externalDocs)
      openapi.externalDocs = openapiMeta.externalDocs;
  }

  return openapi;
};


