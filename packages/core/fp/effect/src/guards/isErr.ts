// @resultsafe/core-fp-effect/src/guards/isErr.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import type { Result } from '@resultsafe/core-fp-result';
import { isErr as resultIsErr } from '@resultsafe/core-fp-result';

export const isErr = async <R, E, T>(
  effect: Effect<R, E, T>,
  context: R,
): Promise<boolean> => {
  const result: Result<T, E> = await effect(context);
  return resultIsErr(result);
};


