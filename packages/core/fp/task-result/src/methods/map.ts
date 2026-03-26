// @resultsafe/core-fp-task-result/src/methods/map.ts

import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const map =
  <T, U, E>(
    taskResult: TaskResult<T, E>,
    fn: (value: T) => U,
  ): TaskResult<U, E> =>
  () =>
    taskResult().then((result) =>
      result.ok ? { ok: true, value: fn(result.value) } : result,
    );


