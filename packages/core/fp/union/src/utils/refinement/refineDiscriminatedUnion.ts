// @resultsafe/core-fp-union/src/utils/refinement/refineDiscriminatedUnion.ts

import type { DiscriminatedUnion } from '../../types/variant/DiscriminatedUnion.js';

export const refineDiscriminatedUnion = <
  T extends DiscriminatedUnion,
  R extends T = T,
>(
  value: T,
  predicate: (value: T) => value is R,
): R | null => {
  return predicate(value) ? value : null;
};


