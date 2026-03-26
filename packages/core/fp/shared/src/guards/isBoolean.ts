// src/guards/isBoolean.ts
/**
 * [EN] Type guard to check if value is a boolean
 * [RU] Тип-гард для проверки, что значение — булево
 */
export const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean';
