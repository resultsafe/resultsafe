// @resultsafe/core-fp-codec/src/methods/.ts

import type { Guard } from '@resultsafe/core-fp-codec';

export const guard = <T>(g: Guard<T>, input: unknown): input is T =>
  g.guard(input);


