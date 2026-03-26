// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-geo-restrictions.ts

/**
 * Расширение OpenAPI: x-geo-restrictions
 * Определяет географические ограничения на использование схемы или операции.
 */

export interface XGeoRestrictions {
  /**
   * Разрешённые страны (ISO 3166-1 alpha-2).
   * @example
   *   x-allowed-countries: ["US", "CA", "GB"]
   */
  'x-allowed-countries'?: string[];

  /**
   * Запрещённые страны.
   * @example
   *   x-blocked-countries: ["RU", "BY"]
   */
  'x-blocked-countries'?: string[];

  /**
   * Требуется ли геолокация для доступа.
   * @example
   *   x-geo-required: true
   */
  'x-geo-required'?: boolean;

  /**
   * Метод определения местоположения (IP, GPS, ручной выбор).
   * @example
   *   x-geo-method: "ip"
   */
  'x-geo-method'?: 'ip' | 'gps' | 'manual' | string;

  /**
   * Опциональное описание — юридические основания для ограничений.
   * @example
   *   x-geo-reason: "Compliance with export control regulations"
   */
  'x-geo-reason'?: string;
}


