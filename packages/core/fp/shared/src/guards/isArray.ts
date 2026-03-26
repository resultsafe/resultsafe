// src/guards/isArray.ts
/**
 * [EN] Type guard to check if value is an array
 * [RU] Тип-гард для проверки, что значение — массив
 */
export const isArray = <T>(value: unknown): value is T[] =>
  Array.isArray(value);
