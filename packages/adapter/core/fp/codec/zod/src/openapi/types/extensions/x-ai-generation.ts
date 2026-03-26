// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-ai-generation.ts

/**
 * Расширение OpenAPI: x-ai-generation
 * Помечает схемы, сгенерированные или модифицированные ИИ — для прозрачности и аудита.
 */

export interface XAIGeneration {
  /**
   * Флаг: была ли схема сгенерирована ИИ.
   * @example
   *   x-ai-generated: true
   */
  'x-ai-generated'?: boolean;

  /**
   * Модель ИИ, использованная для генерации.
   * @example
   *   x-ai-model: "gpt-4-turbo"
   */
  'x-ai-model'?: string;

  /**
   * Версия модели ИИ.
   * @example
   *   x-ai-model-version: "2024-04-09"
   */
  'x-ai-model-version'?: string;

  /**
   * Процент кода, сгенерированного ИИ.
   * @example
   *   x-ai-percentage: 85
   */
  'x-ai-percentage'?: number;

  /**
   * Флаг: прошла ли схема ручной аудит человеком.
   * @example
   *   x-ai-human-reviewed: true
   */
  'x-ai-human-reviewed'?: boolean;

  /**
   * Опциональное описание — почему использован ИИ.
   * @example
   *   x-ai-reason: "Accelerated development of internal API"
   */
  'x-ai-reason'?: string;
}


