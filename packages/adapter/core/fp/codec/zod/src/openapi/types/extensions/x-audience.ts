// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-audience.ts

/**
 * Расширение OpenAPI: x-audience
 * Определяет, для кого предназначена схема или поле — для документации и контроля доступа.
 */

export interface XAudience {
  /**
   * Целевая аудитория: внутренние команды, партнёры, публичные пользователи и т.д.
   * @example
   *   x-audience: ["internal", "partner"]
   */
  'x-audience'?: ('public' | 'internal' | 'partner' | 'admin' | string)[];

  /**
   * Опциональное описание — почему эта аудитория.
   * @example
   *   x-audience-reason: "Contains PII, not for public exposure"
   */
  'x-audience-reason'?: string;

  /**
   * Дата, до которой ограничение аудитории актуально.
   * @example
   *   x-audience-until: "2025-12-31"
   */
  'x-audience-until'?: string; // ISO 8601
}


