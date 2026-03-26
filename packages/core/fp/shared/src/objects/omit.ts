// src/objects/omit.ts
/**
 * [EN] Returns a new object with specified keys omitted
 * [RU] Возвращает новый объект с исключёнными указанными ключами
 */
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
};
