// @resultsafe/core-fp-codec-zod/src/openapi/types/base.ts

/**
 * Базовые примитивы — общие для всех версий OpenAPI
 */
export type PrimitiveType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'array'
  | 'object'
  | 'null';

/**
 * Базовый набор метаданных — присутствует во всех версиях
 */
export interface BaseMetadata {
  description?: string;
  example?: any;
  examples?: any[];
  deprecated?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
}

/**
 * Базовые композитные операторы — поддерживаются везде
 */
export interface BaseComposition {
  allOf?: OpenAPISchema[];
  anyOf?: OpenAPISchema[];
  oneOf?: OpenAPISchema[];
  not?: OpenAPISchema;
}

/**
 * Базовый enum — универсальный
 */
export interface BaseEnum {
  enum?: any[];
}

/**
 * Базовый дискриминатор — для oneOf
 */
export interface BaseDiscriminator {
  discriminator?: {
    propertyName: string;
    mapping?: Record<string, string>;
  };
}

/**
 * Базовые расширения — для кастомных полей
 */
export interface BaseExtensions {
  [key: `x-${string}`]: any; // Все x- расширения
  [key: string]: any; // Любые другие — для будущих версий
}


