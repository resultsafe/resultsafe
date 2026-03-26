// @resultsafe/core-fp-codec-zod/src/openapi/types/index.ts

export type {
  OpenAPISchemaV3_0,
  OpenAPISchemaV3_1,
  OpenAPISchemaV4_0,
} from './v3_0.js'; // Экспортируем все версии из одного файла для удобства

// Расширения
export type { XInternal } from './extensions/x-internal.js';
export type { XNullable } from './extensions/x-nullable.js';

// Утилиты
export { convertV3_0toV3_1 } from './utils/merge.js';

// Алиас по умолчанию — можно настроить под проект
export type OpenAPISchema = OpenAPISchemaV3_1;


