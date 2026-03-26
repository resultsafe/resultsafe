// @resultsafe/core-fp-codec-zod/src/openapi/types/v3_0.ts

import type {
  BaseComposition,
  BaseDiscriminator,
  BaseEnum,
  BaseExtensions,
  BaseMetadata,
  PrimitiveType,
} from './base.js';

/**
 * OpenAPI 3.0 Schema Object
 * @see https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#schemaObject
 */
export interface OpenAPISchemaV3_0
  extends BaseMetadata,
    BaseComposition,
    BaseEnum,
    BaseDiscriminator,
    BaseExtensions {
  type?: PrimitiveType | PrimitiveType[];
  format?: string;

  // object
  properties?: Record<string, OpenAPISchemaV3_0>;
  required?: string[];
  additionalProperties?: boolean | OpenAPISchemaV3_0;

  // array
  items?: OpenAPISchemaV3_0;

  // string
  pattern?: string;
  minLength?: number;
  maxLength?: number;

  // number/integer
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: boolean; // ← в 3.0 это boolean
  exclusiveMaximum?: boolean;
  multipleOf?: number;

  // xml, externalDocs и др. — можно добавить при необходимости
}


