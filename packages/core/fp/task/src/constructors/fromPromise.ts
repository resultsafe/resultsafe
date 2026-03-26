// @resultsafe/core-fp-task/src/constructors/fromPromise.ts

import type { Task } from '@resultsafe/core-fp-task';

export const fromPromise =
  <T>(promise: Promise<T>): Task<T> =>
  () =>
    promise;


