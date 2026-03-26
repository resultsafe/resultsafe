// @resultsafe/core-fp-effect/src/methods/provide.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import type { Result } from '@resultsafe/core-fp-result';

export const provide = <R, E, T>(
  effect: Effect<R, E, T>,
  context: R,
): Promise<Result<T, E>> => effect(context);


