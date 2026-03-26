// @resultsafe/core-fp-codec-zod/src/openapi/types/utils/merge.ts

import type { OpenAPISchemaV3_0, OpenAPISchemaV3_1 } from '../index.js';

/**
 * Конвертирует OpenAPI 3.0 → 3.1 (например, exclusiveMinimum: boolean → number)
 */
export const convertV3_0toV3_1 = (
  schema: OpenAPISchemaV3_0,
): OpenAPISchemaV3_1 => {
  const { exclusiveMinimum, exclusiveMaximum, ...rest } = schema;
  return {
    ...rest,
    ...(exclusiveMinimum !== undefined && {
      exclusiveMinimum:
        typeof exclusiveMinimum === 'boolean' ? 0 : exclusiveMinimum,
    }),
    ...(exclusiveMaximum !== undefined && {
      exclusiveMaximum:
        typeof exclusiveMaximum === 'boolean' ? 0 : exclusiveMaximum,
    }),
  };
};


