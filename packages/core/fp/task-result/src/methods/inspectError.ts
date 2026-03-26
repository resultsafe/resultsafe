// @resultsafe/core-fp-task-result/src/methods/inspectError.ts

import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const inspectError =
  <T, E>(
    taskResult: TaskResult<T, E>,
    fn: (error: E) => void,
  ): TaskResult<T, E> =>
  () =>
    taskResult().then((result) => {
      if (!result.ok) fn(result.error);
      return result;
    });


