// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-rate-limit.ts

/**
 * Расширение OpenAPI: x-rate-limit
 * Определяет политики rate limiting для операций или схем (если схема используется в ответе).
 */

export interface XRateLimit {
  /**
   * Максимальное количество запросов в указанный период.
   * @example
   *   x-rate-limit-limit: 100
   */
  'x-rate-limit-limit'?: number;

  /**
   * Период в секундах, за который применяется лимит.
   * @example
   *   x-rate-limit-period: 60  // 100 запросов в минуту
   */
  'x-rate-limit-period'?: number;

  /**
   * Группа/ключ для лимитирования (например, по user_id, api_key, IP).
   * @example
   *   x-rate-limit-key: "user_id"
   */
  'x-rate-limit-key'?: string;

  /**
   * Флаг: применять ли лимит глобально или на ноду.
   * @example
   *   x-rate-limit-global: false
   */
  'x-rate-limit-global'?: boolean;

  /**
   * Опциональное описание — почему такие лимиты.
   * @example
   *   x-rate-limit-reason: "Prevent abuse of user profile endpoint"
   */
  'x-rate-limit-reason'?: string;
}


