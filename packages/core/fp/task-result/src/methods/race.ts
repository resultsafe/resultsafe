import type { Result } from '@resultsafe/core-fp-result';
import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const race =
  <T, E>(
    taskResult1: TaskResult<T, E>,
    taskResult2: TaskResult<T, E>,
  ): TaskResult<T, E> =>
  () =>
    new Promise<Result<T, E>>((resolve) => {
      const wrap = (tr: TaskResult<T, E>) =>
        tr()
          .then(resolve)
          .catch((err) => resolve({ ok: false, error: err } as Result<T, E>));

      wrap(taskResult1);
      wrap(taskResult2);
    });


