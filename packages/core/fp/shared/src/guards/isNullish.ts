// src/guards/isNullish.ts
/**
 * [EN] Type guard to check if value is null or undefined
 * [RU] Тип-гард для проверки, что значение — null или undefined
 */
export const isNullish = (value: unknown): value is null | undefined =>
  value === null || value === undefined;
