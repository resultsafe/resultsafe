// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-examples.ts

/**
 * Расширение OpenAPI: x-examples
 * Позволяет указать несколько именованных примеров для поля или схемы.
 * Расширяет стандартное поле `example` / `examples`.
 */

export interface XExamples {
  /**
   * Объект с именованными примерами. Ключ — название примера, значение — сам пример.
   * @example
   *   x-examples:
   *     validEmail: "user@example.com"
   *     invalidEmail: "not-an-email"
   */
  'x-examples'?: Record<string, any>;
}


