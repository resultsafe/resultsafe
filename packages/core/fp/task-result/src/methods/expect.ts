// @resultsafe/core-fp-task-result/src/methods/expect.ts

import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const expect = <T, E>(
  taskResult: TaskResult<T, E>,
  msg: string,
): Promise<T> =>
  taskResult().then((result) =>
    result.ok ? result.value : Promise.reject(new Error(msg)),
  );


