// src/guards/isObject.ts
/**
 * [EN] Type guard to check if value is a non-null object (not array)
 * [RU] Тип-гард для проверки, что значение — не-null объект (не массив)
 */
export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
