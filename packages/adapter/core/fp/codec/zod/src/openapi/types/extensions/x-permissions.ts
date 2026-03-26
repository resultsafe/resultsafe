// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-permissions.ts

/**
 * Расширение OpenAPI: x-permissions
 * Определяет права доступа, необходимые для использования схемы, поля или операции.
 * Используется для генерации RBAC-документации и middleware.
 */

export interface XPermissions {
  /**
   * Массив разрешений (permissions), необходимых для доступа.
   * @example
   *   x-permissions: ["user:read", "admin:write"]
   */
  'x-permissions'?: string[];

  /**
   * Опциональный массив ролей, которым разрешён доступ.
   * @example
   *   x-roles: ["admin", "support"]
   */
  'x-roles'?: string[];

  /**
   * Флаг: требует ли доступ к полю/схеме аутентификации.
   * @example
   *   x-requires-auth: true
   */
  'x-requires-auth'?: boolean;

  /**
   * Опциональное описание политики доступа (может ссылаться на внутренний документ).
   * @example
   *   x-policy-ref: "https://internal.wiki/access-policy#section-5"
   */
  'x-policy-ref'?: string;
}


