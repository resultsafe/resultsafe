// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-logging.ts

/**
 * Расширение OpenAPI: x-logging
 * Управляет тем, как и что логируется при использовании схемы (в запросах/ответах).
 */

export interface XLogging {
  /**
   * Уровень логирования для операций, использующих эту схему.
   * @example
   *   x-log-level: "info"
   */
  'x-log-level'?: 'debug' | 'info' | 'warn' | 'error' | string;

  /**
   * Флаг: логировать ли тело запроса/ответа (может содержать PII).
   * @example
   *   x-log-body: false
   */
  'x-log-body'?: boolean;

  /**
   * Массив полей, которые нужно маскировать в логах.
   * @example
   *   x-log-mask-fields: ["password", "token", "ssn"]
   */
  'x-log-mask-fields'?: string[];

  /**
   * Флаг: включать ли в логи метрики выполнения (latency, status).
   * @example
   *   x-log-metrics: true
   */
  'x-log-metrics'?: boolean;

  /**
   * Опциональное описание — политика хранения логов.
   * @example
   *   x-log-retention: "30 days"
   */
  'x-log-retention'?: string;
}


