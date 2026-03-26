import { existsSync, readFileSync } from 'node:fs';
import YAML from 'yaml';

/**
 * Загружает паттерны из YAML файла.
 */
export const loadPatternsYAML = (path) => {
  if (!existsSync(path)) {
    console.warn(`Файл ${path} не найден. Используем пустой набор паттернов.`);
    return {};
  }

  try {
    return YAML.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    console.error(`Ошибка чтения YAML: ${err.message}`);
    return {};
  }
};
