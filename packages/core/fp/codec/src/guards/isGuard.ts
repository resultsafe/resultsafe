// @resultsafe/core-fp-codec/src/guards/is.ts

import type { Guard } from '@resultsafe/core-fp-codec';

export const isGuard = <T>(x: unknown): x is Guard<T> =>
  typeof x === 'object' && x !== null && 'guard' in x;


