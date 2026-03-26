// @resultsafe/core-fp-effect/src/guards/isOkAnd.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import { isOkAnd as resultIsOkAnd } from '@resultsafe/core-fp-result';

export const isOkAnd = <R, E, T>(
  effect: Effect<R, E, T>,
  predicate: (value: T) => boolean,
): boolean => resultIsOkAnd(effect as any, predicate);


