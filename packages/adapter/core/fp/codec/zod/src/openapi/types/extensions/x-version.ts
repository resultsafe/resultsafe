// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-version.ts

/**
 * Расширение OpenAPI: x-version
 * Позволяет явно указать версию схемы — для миграций и совместимости.
 */

export interface XVersion {
  /**
   * Версия схемы — семантическое версионирование.
   * @example
   *   x-version: "1.2.0"
   */
  'x-version'?: string;

  /**
   * История изменений — массив версий с описанием.
   * @example
   *   x-changelog:
   *     - version: "1.1.0"
   *       changes: "Added email field"
   *     - version: "1.2.0"
   *       changes: "Made name required"
   */
  'x-changelog'?: {
    version: string;
    changes: string;
    date?: string; // ISO 8601
  }[];

  /**
   * Совместимость с другими версиями (backward/forward).
   * @example
   *   x-compatibility: "backward"
   */
  'x-compatibility'?: 'backward' | 'forward' | 'none' | string;
}


