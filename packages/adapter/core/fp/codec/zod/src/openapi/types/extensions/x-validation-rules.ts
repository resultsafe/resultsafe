// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-validation-rules.ts

/**
 * Расширение OpenAPI: x-validation-rules
 * Позволяет описать кастомные бизнес-правила валидации, не покрываемые JSON Schema.
 */

export interface XValidationRules {
  /**
   * Массив описаний кастомных правил — для документации и генерации тестов.
   * @example
   *   x-validation-rules:
   *     - "Password must contain at least one digit"
   *     - "Email domain must be company-approved"
   */
  'x-validation-rules'?: string[];

  /**
   * Ссылка на функцию или микросервис, реализующий валидацию.
   * @example
   *   x-validation-service: "auth-service/validate-password"
   */
  'x-validation-service'?: string;

  /**
   * Флаг: является ли валидация асинхронной (требует вызова внешнего сервиса).
   * @example
   *   x-validation-async: true
   */
  'x-validation-async'?: boolean;

  /**
   * Максимальное время выполнения валидации в миллисекундах.
   * @example
   *   x-validation-timeout: 500
   */
  'x-validation-timeout'?: number;

  /**
   * Опциональное описание — почему нужны кастомные правила.
   * @example
   *   x-validation-reason: "Legacy business logic not expressible in schema"
   */
  'x-validation-reason'?: string;
}


