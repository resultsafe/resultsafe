// @resultsafe/core-fp-codec/src/constructors/createSerializer.ts

import type { Serializer } from '@resultsafe/core-fp-codec';

export const createSerializer = <T>(
  fn: (output: T) => string,
): Serializer<T> => ({
  serialize: fn,
});


