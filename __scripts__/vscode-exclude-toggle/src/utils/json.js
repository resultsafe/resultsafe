import { existsSync, readFileSync } from 'node:fs';

/**
 * Безопасно читает JSON из файла.
 * Если файла нет, пустой или повреждённый — возвращает fallback.
 */
export const loadJSON = (path, fallback = {}) => {
  if (!existsSync(path)) return fallback;
  try {
    const content = readFileSync(path, 'utf8').trim();
    if (!content) return fallback;
    return JSON.parse(content);
  } catch {
    return fallback;
  }
};
