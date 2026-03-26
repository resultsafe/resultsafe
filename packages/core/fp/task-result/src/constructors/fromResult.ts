// @resultsafe/core-fp-task-result/src/constructors/fromResult.ts

import type { Result } from '@resultsafe/core-fp-result';
import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const fromResult =
  <T, E>(result: Result<T, E>): TaskResult<T, E> =>
  () =>
    Promise.resolve(result);


