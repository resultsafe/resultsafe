// @resultsafe/core-fp-task-result/src/methods/unwrap.ts

import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const unwrap = <T, E>(taskResult: TaskResult<T, E>): Promise<T> =>
  taskResult().then((result) => {
    if (!result.ok) {
      throw new Error('Called unwrap on an Err value');
    }
    return result.value;
  });


