// @resultsafe/core-fp-codec/src/constructors/create.ts

import type { Guard } from '@resultsafe/core-fp-codec';

export const createGuard = <T>(
  fn: (input: unknown) => input is T,
): Guard<T> => ({
  guard: fn,
});


