// @resultsafe/core-fp-union/src/utils/matching/matchDiscriminatedUnionStrict.ts

import type { DiscriminatedUnion } from '../../types/variant/index.js';

export const matchDiscriminatedUnionStrict = <
  T extends DiscriminatedUnion,
  TMap extends { [K in T['type']]: (value: Extract<T, { type: K }>) => any },
>(
  value: T,
  cases: TMap & {
    [K in T['type']]: (value: Extract<T, { type: K }>) => any;
  }, // ✅ Обязывает обработать все варианты
): ReturnType<TMap[T['type']]> => {
  const handler = cases[value.type as T['type']];
  if (!handler) {
    throw new Error(`Unhandled variant: ${value.type}`);
  }
  return handler(value as any);
};


