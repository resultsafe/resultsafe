// @resultsafe/core-fp-task-result/src/methods/mapError.ts

import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const mapError =
  <T, E, F>(
    taskResult: TaskResult<T, E>,
    fn: (error: E) => F,
  ): TaskResult<T, F> =>
  () =>
    taskResult().then((result) =>
      !result.ok ? { ok: false, error: fn(result.error) } : result,
    );


