// @resultsafe/core-fp-effect/src/guards/isErrAnd.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import type { Result } from '@resultsafe/core-fp-result';
import { isErrAnd as resultIsErrAnd } from '@resultsafe/core-fp-result';

export const isErrAnd = async <R, E, T>(
  effect: Effect<R, E, T>,
  predicate: (error: E) => boolean,
  context: R,
): Promise<boolean> => {
  const result: Result<T, E> = await effect(context);
  return resultIsErrAnd(result, predicate);
};


