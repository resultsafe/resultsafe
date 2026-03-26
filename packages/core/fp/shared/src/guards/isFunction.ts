// src/guards/isFunction.ts
/**
 * [EN] Type guard to check if value is a function
 * [RU] Тип-гард для проверки, что значение — функция
 */
export const isFunction = <T extends (...args: any[]) => any>(
  value: unknown,
): value is T => typeof value === 'function';
