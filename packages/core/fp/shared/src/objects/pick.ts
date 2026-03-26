// src/objects/pick.ts
import { hasOwn } from '../guards/index.js';

/**
 * [EN] Returns a new object with only specified keys
 * [RU] Возвращает новый объект, содержащий только указанные ключи
 */
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (hasOwn(obj, key)) {
      result[key] = obj[key];
    }
  }
  return result;
};
