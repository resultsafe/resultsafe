// src/arrays/isEmpty.ts

/**
 * [EN] Checks if array is empty
 * [RU] Проверяет, пуст ли массив
 */
export const isEmpty = <T>(arr: readonly T[]): boolean => arr.length === 0;
