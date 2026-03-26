// src/guards/isNumber.ts
/**
 * [EN] Type guard to check if value is a number (and not NaN)
 * [RU] Тип-гард для проверки, что значение — число (и не NaN)
 */
export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && !isNaN(value);
