// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-migration-path.ts

/**
 * Расширение OpenAPI: x-migration-path
 * Описывает, как мигрировать с этой схемы на другую — для автоматических трансформаций.
 */

export interface XMigrationPath {
  /**
   * Имя или ссылка на целевую схему, на которую нужно мигрировать.
   * @example
   *   x-migration-target: "#/components/schemas/UserProfileV2"
   */
  'x-migration-target'?: string;

  /**
   * Описание шагов миграции — для разработчиков и автоматических трансформеров.
   * @example
   *   x-migration-steps:
   *     - "Map 'fullName' to 'firstName + lastName'"
   *     - "Convert 'dob' from string to date object"
   */
  'x-migration-steps'?: string[];

  /**
   * Флаг: является ли миграция обратимой.
   * @example
   *   x-migration-reversible: false
   */
  'x-migration-reversible'?: boolean;

  /**
   * Ссылка на скрипт или функцию, выполняющую миграцию.
   * @example
   *   x-migration-script: "migrations/user-profile-v1-to-v2.ts"
   */
  'x-migration-script'?: string;

  /**
   * Дата, после которой старая схема считается deprecated.
   * @example
   *   x-migration-deadline: "2025-12-31"
   */
  'x-migration-deadline'?: string; // ISO 8601
}


