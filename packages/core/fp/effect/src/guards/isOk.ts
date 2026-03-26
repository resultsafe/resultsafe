// @resultsafe/core-fp-effect/src/guards/isOk.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import type { Result } from '@resultsafe/core-fp-result';
import { isOk as resultIsOk } from '@resultsafe/core-fp-result';

export const isOk = <R, E, T>(
  effect: Effect<R, E, T>,
  context: R,
): Promise<boolean> =>
  effect(context).then((result: Result<T, E>) => resultIsOk(result));


