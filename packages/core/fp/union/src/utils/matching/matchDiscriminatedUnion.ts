// @resultsafe/core-fp-union/src/utils/matching/matchDiscriminatedUnion.ts

import type { DiscriminatedUnion } from '../../types/variant/index.js';

export const matchDiscriminatedUnion = <
  T extends DiscriminatedUnion,
  R,
  TMap extends Record<string, (value: T) => R>,
>(
  value: T,
  cases: TMap,
): R => {
  const fn = cases[value.type];
  if (fn) {
    return fn(value);
  }
  throw new Error(`Unhandled variant: ${value.type}`);
};


