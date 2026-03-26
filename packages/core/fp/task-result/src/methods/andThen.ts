// @resultsafe/core-fp-task-result/src/methods/andThen.ts

import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const andThen =
  <T, U, E>(
    taskResult: TaskResult<T, E>,
    fn: (value: T) => TaskResult<U, E>,
  ): TaskResult<U, E> =>
  () =>
    taskResult().then((result) =>
      result.ok ? fn(result.value)() : Promise.resolve(result),
    );


