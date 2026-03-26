// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-localization.ts

/**
 * Расширение OpenAPI: x-localization
 * Управляет локализацией полей и схем — для многоязычных API.
 */

export interface XLocalization {
  /**
   * Поддерживаемые языки (языковые теги IETF BCP 47).
   * @example
   *   x-supported-locales: ["en-US", "es-ES", "zh-CN"]
   */
  'x-supported-locales'?: string[];

  /**
   * Язык по умолчанию.
   * @example
   *   x-default-locale: "en-US"
   */
  'x-default-locale'?: string;

  /**
   * Флаг: является ли схема локализуемой (содержит переводимые строки).
   * @example
   *   x-localizable: true
   */
  'x-localizable'?: boolean;

  /**
   * Ссылка на систему управления переводами (CMS, Crowdin, Lokalise).
   * @example
   *   x-translation-service: "https://translate.company.com/project/api-v1"
   */
  'x-translation-service'?: string;

  /**
   * Опциональное описание — политика обновления переводов.
   * @example
   *   x-translation-update-policy: "Updated weekly from Crowdin"
   */
  'x-translation-update-policy'?: string;
}


