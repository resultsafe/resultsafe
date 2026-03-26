// src/arrays/tail.ts
/**
 * [EN] Returns all elements except the first
 * [RU] Возвращает все элементы, кроме первого
 */
export const tail = <T>(arr: readonly T[]): T[] => arr.slice(1);
