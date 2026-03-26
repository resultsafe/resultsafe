// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-tags.ts

/**
 * Расширение OpenAPI: x-tags
 * Позволяет добавить теги к схеме, полю или операции для группировки в документации.
 * Поддерживается Redoc, Swagger UI, Stoplight.
 */

export interface XTags {
  /**
   * Массив строк-тегов для группировки и фильтрации в документации.
   * @example
   *   x-tags: ["auth", "user", "deprecated"]
   */
  'x-tags'?: string[];
}


