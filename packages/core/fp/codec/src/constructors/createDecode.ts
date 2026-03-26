// @resultsafe/core-fp-codec/src/constructors/createDecode.ts

import type { Decode } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result-shared';

export const createDecode = <T>(
  fn: (input: unknown) => Result<T, string>,
): Decode<T> => ({
  decode: fn,
});


