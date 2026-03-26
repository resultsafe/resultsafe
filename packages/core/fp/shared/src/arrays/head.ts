// src/arrays/head.ts
/**
 * [EN] Returns first element of array or undefined if empty
 * [RU] Возвращает первый элемент массива или undefined, если массив пуст
 */
export const head = <T>(arr: readonly T[]): T | undefined => arr[0];
