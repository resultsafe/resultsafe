// @resultsafe/core-fp-codec-zod/src/openapi/types/v3_1.ts

import type { OpenAPISchemaV3_0 } from './v3_0.js';

/**
 * OpenAPI 3.1 Schema Object — наследует 3.0, но с уточнениями
 * @see https://spec.openapis.org/oas/v3.1.0#schema-object
 */
export interface OpenAPISchemaV3_1
  extends Omit<OpenAPISchemaV3_0, 'exclusiveMinimum' | 'exclusiveMaximum'> {
  exclusiveMinimum?: number; // ← в 3.1 это number (порог), а не boolean
  exclusiveMaximum?: number;
  // Также добавляет поддержку JSON Schema 2020-12 — можно расширить
}


