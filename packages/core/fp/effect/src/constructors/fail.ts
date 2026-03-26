// @resultsafe/core-fp-effect/src/constructors/fail.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import { err } from '@resultsafe/core-fp-result';

export const fail =
  <R, E, T = never>(error: E): Effect<R, E, T> =>
  () =>
    Promise.resolve(err(error));


