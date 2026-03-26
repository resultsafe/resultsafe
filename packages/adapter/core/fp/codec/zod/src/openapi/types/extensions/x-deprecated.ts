// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-deprecated.ts

/**
 * Расширение OpenAPI: x-deprecated
 * Расширяет стандартное `deprecated: boolean` — добавляет контекст и сроки.
 */

export interface XDeprecated {
  /**
   * Флаг: устарело ли поле/схема.
   * @example
   *   x-deprecated: true
   */
  'x-deprecated'?: boolean;

  /**
   * Опциональная дата, когда элемент был помечен как устаревший.
   * @example
   *   x-deprecated-since: "2024-01-15"
   */
  'x-deprecated-since'?: string; // ISO 8601

  /**
   * Опциональная дата, когда элемент будет удалён.
   * @example
   *   x-removed-after: "2025-01-15"
   */
  'x-removed-after'?: string; // ISO 8601

  /**
   * Опциональное описание — почему устарел и на что заменить.
   * @example
   *   x-replacement: "Use `userProfile` instead"
   */
  'x-replacement'?: string;
}


