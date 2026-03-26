// @resultsafe/core-fp-effect/src/methods/tapError.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import { tapErr as resultTapErr } from '@resultsafe/core-fp-result';

export const tapError =
  <R, E, T>(effect: Effect<R, E, T>, fn: (error: E) => void): Effect<R, E, T> =>
  (context: R) =>
    effect(context).then((result) => {
      // resultTapErr строго возвращает Result<T, E>
      return resultTapErr(result, fn);
    });


