// @resultsafe/core-fp-effect/src/methods/expect.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import { expect as resultExpect } from '@resultsafe/core-fp-result';

export const expect = <R, E, T>(
  effect: Effect<R, E, T>,
  msg: string,
  context: R,
): Promise<T> => effect(context).then((result) => resultExpect(result, msg));


