// @resultsafe/core-fp-task-result/src/methods/allSettled.ts

import type { Result } from '@resultsafe/core-fp-result';
import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const allSettled =
  <T, E>(
    taskResults: readonly TaskResult<T, E>[],
  ): TaskResult<Result<T, E>[], never> =>
  () =>
    Promise.allSettled(taskResults.map((tr) => tr())).then((results) => {
      const settled: Result<T, E>[] = results.map((r) =>
        r.status === 'fulfilled'
          ? r.value
          : ({ ok: false, error: r.reason } as Result<T, E>),
      );

      return { ok: true, value: settled };
    });


