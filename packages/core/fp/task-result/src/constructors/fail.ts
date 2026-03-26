// @resultsafe/core-fp-task-result/src/constructors/fail.ts

import { err } from '@resultsafe/core-fp-result';
import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const fail =
  <E, T = never>(error: E): TaskResult<T, E> =>
  () =>
    Promise.resolve(err(error));


