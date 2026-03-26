// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-cost-estimation.ts

/**
 * Расширение OpenAPI: x-cost-estimation
 * Предоставляет оценку стоимости использования операции или схемы.
 */

export interface XCostEstimation {
  /**
   * Стоимость одного вызова в условных единицах.
   * @example
   *   x-cost-per-call: 0.001
   */
  'x-cost-per-call'?: number;

  /**
   * Валюта стоимости.
   * @example
   *   x-cost-currency: "USD"
   */
  'x-cost-currency'?: string;

  /**
   * Единица измерения (вызовы, мегабайты, минуты и т.д.).
   * @example
   *   x-cost-unit: "call"
   */
  'x-cost-unit'?: 'call' | 'mb' | 'minute' | string;

  /**
   * Бесплатный лимит (включён в подписку).
   * @example
   *   x-cost-free-tier: 1000
   */
  'x-cost-free-tier'?: number;

  /**
   * Ссылка на калькулятор стоимости.
   * @example
   *   x-cost-calculator: "https://company.com/pricing/calculator"
   */
  'x-cost-calculator'?: string;

  /**
   * Опциональное описание — что входит в стоимость.
   * @example
   *   x-cost-details: "Includes compute, bandwidth, and storage"
   */
  'x-cost-details'?: string;
}


