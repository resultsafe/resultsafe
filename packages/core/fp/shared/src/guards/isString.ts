// src/guards/isString.ts
/**
 * [EN] Type guard to check if value is a string
 * [RU] Тип-гард для проверки, что значение — строка
 */
export const isString = (value: unknown): value is string =>
  typeof value === 'string';
