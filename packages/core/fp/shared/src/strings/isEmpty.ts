// src/strings/isEmpty.ts
/**
 * [EN] Checks if string is empty or whitespace only
 * [RU] Проверяет, пуста ли строка или содержит только пробелы
 */
export const isEmpty = (str: string): boolean => str.trim().length === 0;
