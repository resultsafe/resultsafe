// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-order.ts

/**
 * Расширение OpenAPI: x-order
 * Задаёт порядок отображения поля в документации или формах.
 * Используется генераторами документации (Redoc, Swagger) и UI-библиотеками.
 */

export interface XOrder {
  /**
   * Числовой приоритет отображения. Меньше число = выше в списке.
   * @example
   *   x-order: 10
   */
  'x-order'?: number;
}


