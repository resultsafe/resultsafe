// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-nullable.ts

/**
 * Расширение OpenAPI: x-nullable
 * Указывает, что поле может быть null, даже если в схеме type не включает 'null'.
 * Актуально для OpenAPI 3.0 (в 3.1 null включается через type: [..., 'null']).
 */

export interface XNullable {
  /**
   * Если true — поле может быть null, даже если type не включает 'null'.
   * @example
   *   x-nullable: true
   */
  'x-nullable'?: boolean;
}


