// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-cors.ts

/**
 * Расширение OpenAPI: x-cors
 * Управляет CORS-политиками для операций, возвращающих эту схему.
 */

export interface XCors {
  /**
   * Разрешённые origins — '*' или массив строк.
   * @example
   *   x-cors-allowed-origins: ["https://trusted.com", "https://*.company.com"]
   */
  'x-cors-allowed-origins'?: string | string[];

  /**
   * Разрешённые методы.
   * @example
   *   x-cors-allowed-methods: ["GET", "POST"]
   */
  'x-cors-allowed-methods'?: string[];

  /**
   * Разрешённые заголовки.
   * @example
   *   x-cors-allowed-headers: ["Authorization", "Content-Type"]
   */
  'x-cors-allowed-headers'?: string[];

  /**
   * Флаг: разрешить credentials (cookies, авторизацию).
   * @example
   *   x-cors-allow-credentials: true
   */
  'x-cors-allow-credentials'?: boolean;

  /**
   * Максимальный возраст preflight-запроса в секундах.
   * @example
   *   x-cors-max-age: 86400
   */
  'x-cors-max-age'?: number;

  /**
   * Опциональное описание — почему такие CORS-настройки.
   * @example
   *   x-cors-reason: "Required for partner integrations"
   */
  'x-cors-reason'?: string;
}


