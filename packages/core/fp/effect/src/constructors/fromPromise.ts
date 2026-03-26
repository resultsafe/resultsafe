// @resultsafe/core-fp-effect/src/constructors/fromPromise.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import { err, ok } from '@resultsafe/core-fp-result';

export const fromPromise =
  <R, T, E = unknown>(promise: Promise<T>): Effect<R, E, T> =>
  () =>
    promise.then(ok).catch((error) => err(error as E));


