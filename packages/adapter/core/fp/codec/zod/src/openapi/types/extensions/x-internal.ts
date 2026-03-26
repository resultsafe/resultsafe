// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-internal.ts

/**
 * Расширение OpenAPI: x-internal
 * Помечает схемы, поля или операции как внутренние — не для публичной документации.
 * Используется в Redoc, Swagger, и кастомных генераторах для скрытия приватных API.
 */

export interface XInternal {
  /**
   * Флаг: если true — элемент считается внутренним и может быть скрыт из публичной документации.
   * @example
   *   x-internal: true
   */
  'x-internal'?: boolean;

  /**
   * Опциональное описание причины, почему элемент помечен как внутренний.
   * @example
   *   x-reason: "Used only for admin dashboard"
   */
  'x-reason'?: string;

  /**
   * Опциональный массив команд/сервисов, которые используют этот элемент.
   * @example
   *   x-used-by: ["billing-service", "admin-portal"]
   */
  'x-used-by'?: string[];

  /**
   * Опциональная дата, до которой элемент будет внутренним.
   * После этой даты — должен быть пересмотрен статус.
   * @example
   *   x-deprecate-after: "2025-12-31"
   */
  'x-deprecate-after'?: string; // ISO 8601 date string

  /**
   * Опциональный контакт (владелец) внутреннего элемента.
   * @example
   *   x-owner: "team-billing@company.com"
   */
  'x-owner'?: string;
}


