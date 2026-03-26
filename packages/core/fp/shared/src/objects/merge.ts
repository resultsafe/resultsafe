//src/objects/merge.ts
import { hasOwn, isObject } from '../guards/index.js';

/**
 * [EN] Deeply merges two objects (arrays are replaced, not merged)
 * [RU] Глубоко объединяет два объекта (массивы заменяются, а не объединяются)
 */
export const merge = <T extends object, U extends object>(
  target: T,
  source: U,
): T & U => {
  const result = { ...target } as T & U;

  for (const key in source) {
    if (hasOwn(source, key)) {
      const keyAsKeyOfU = key as keyof U;
      const value = source[keyAsKeyOfU];

      if (isObject(value) && isObject(result[keyAsKeyOfU])) {
        // ✅ Явно утверждаем, что оба значения — object
        result[keyAsKeyOfU] = merge(
          result[keyAsKeyOfU] as object,
          value as object,
        ) as (T & U)[keyof U];
      } else {
        result[keyAsKeyOfU] = value as (T & U)[keyof U];
      }
    }
  }

  return result;
};
