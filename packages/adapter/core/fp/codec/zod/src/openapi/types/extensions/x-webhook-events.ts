// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-webhook-events.ts

/**
 * Расширение OpenAPI: x-webhook-events
 * Описывает события, которые могут быть отправлены через вебхуки с этой схемой.
 */

export interface XWebhookEvents {
  /**
   * Массив имён событий, которые могут быть отправлены с этой схемой.
   * @example
   *   x-webhook-events: ["user.created", "user.updated"]
   */
  'x-webhook-events'?: string[];

  /**
   * URL шаблон для подписки на вебхуки.
   * @example
   *   x-webhook-subscribe-url: "https://api.company.com/webhooks"
   */
  'x-webhook-subscribe-url'?: string;

  /**
   * Требуемые заголовки для подписки (например, API-ключ).
   * @example
   *   x-webhook-required-headers: ["X-API-Key", "X-Signature"]
   */
  'x-webhook-required-headers'?: string[];

  /**
   * Формат подписи (например, HMAC-SHA256).
   * @example
   *   x-webhook-signature-format: "HMAC-SHA256"
   */
  'x-webhook-signature-format'?: string;

  /**
   * Опциональное описание — как верифицировать вебхуки.
   * @example
   *   x-webhook-verification: "Verify signature using your secret key"
   */
  'x-webhook-verification'?: string;
}


