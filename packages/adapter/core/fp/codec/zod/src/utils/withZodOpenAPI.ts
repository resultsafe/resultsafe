// @resultsafe/core-fp-codec-zod/src/openapi/utils/withZodOpenAPI.ts

import * as z from 'zod';
import type { OpenAPISchema } from '../types.js';

/**
 * Извлекает OpenAPI-метаданные из Zod-схемы, если используется zod.openapi()
 * Поддерживает как официальный пакет `zod-openapi`, так и кастомные реализации
 */
export const extractZodOpenAPI = (
  schema: z.ZodTypeAny,
): Partial<OpenAPISchema> => {
  // Проверяем официальный zod-openapi (@asteasolutions/zod-to-openapi)
  if ('_def' in schema && (schema._def as any).openapi) {
    return (schema._def as any).openapi;
  }

  // Проверяем кастомные реализации (zod.openapi({...}))
  if ('_def' in schema && (schema._def as any).openapiMeta) {
    return (schema._def as any).openapiMeta;
  }

  // Проверяем вложенные схемы (для объектов, массивов и т.д.)
  if ('element' in schema && (schema as any).element) {
    return extractZodOpenAPI((schema as any).element);
  }

  // Проверяем shape для объектов
  if ('shape' in schema && (schema as any).shape) {
    const shape = (schema as any).shape;
    const extracted: Record<string, any> = {};
    for (const key in shape) {
      if (Object.prototype.hasOwnProperty.call(shape, key)) {
        const fieldMeta = extractZodOpenAPI(shape[key]);
        if (Object.keys(fieldMeta).length > 0) {
          extracted[key] = fieldMeta;
        }
      }
    }
    if (Object.keys(extracted).length > 0) {
      return { properties: extracted };
    }
  }

  return {};
};

/**
 * Мержит метаданные из zod.openapi() с существующей OpenAPI-схемой
 * Приоритет: zod.openapi() > автоматическая генерация
 * Глубокий мерж для вложенных объектов
 */
export const mergeWithZodOpenAPI = (
  openapi: OpenAPISchema,
  schema: z.ZodTypeAny,
): OpenAPISchema => {
  const zodMeta = extractZodOpenAPI(schema);

  // Глубокий мерж для properties
  if (zodMeta.properties && openapi.properties) {
    const mergedProperties: Record<string, any> = { ...openapi.properties };

    for (const [key, value] of Object.entries(zodMeta.properties)) {
      if (mergedProperties[key]) {
        // Если свойство уже существует — мержим рекурсивно
        mergedProperties[key] = {
          ...mergedProperties[key],
          ...value,
        };
      } else {
        mergedProperties[key] = value;
      }
    }

    return {
      ...openapi,
      ...zodMeta,
      properties: mergedProperties,
    };
  }

  return {
    ...openapi,
    ...zodMeta,
  };
};


