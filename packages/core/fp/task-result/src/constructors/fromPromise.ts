// @resultsafe/core-fp-task-result/src/constructors/fromPromise.ts

import { err, ok } from '@resultsafe/core-fp-result';
import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const fromPromise =
  <T, E = unknown>(promise: Promise<T>): TaskResult<T, E> =>
  () =>
    promise.then(ok).catch((error) => err(error as E));


