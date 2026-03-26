// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-tracing.ts

/**
 * Расширение OpenAPI: x-tracing
 * Управляет трассировкой запросов — для OpenTelemetry, Jaeger, Zipkin.
 */

export interface XTracing {
  /**
   * Флаг: включена ли трассировка для операций с этой схемой.
   * @example
   *   x-tracing-enabled: true
   */
  'x-tracing-enabled'?: boolean;

  /**
   * Имя спана (span) для трассировки.
   * @example
   *   x-tracing-span-name: "get_user_profile"
   */
  'x-tracing-span-name'?: string;

  /**
   * Уровень семплирования (0.0 - 1.0).
   * @example
   *   x-tracing-sample-rate: 0.1
   */
  'x-tracing-sample-rate'?: number;

  /**
   * Массив тегов для добавления в спан.
   * @example
   *   x-tracing-tags: ["team=user", "service=profile"]
   */
  'x-tracing-tags'?: string[];

  /**
   * Опциональное описание — куда отправляются трейсы.
   * @example
   *   x-tracing-destination: "jaeger-prod:4317"
   */
  'x-tracing-destination'?: string;
}


