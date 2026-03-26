// @resultsafe/core-fp-task-result/src/methods/inspect.ts

import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const inspect =
  <T, E>(
    taskResult: TaskResult<T, E>,
    fn: (value: T) => void,
  ): TaskResult<T, E> =>
  () =>
    taskResult().then((result) => {
      if (result.ok) fn(result.value);
      return result;
    });


