// src/arrays/last.ts
/**
 * [EN] Returns last element of array or undefined if empty
 * [RU] Возвращает последний элемент массива или undefined, если массив пуст
 */
export const last = <T>(arr: readonly T[]): T | undefined =>
  arr.length > 0 ? arr[arr.length - 1] : undefined;
