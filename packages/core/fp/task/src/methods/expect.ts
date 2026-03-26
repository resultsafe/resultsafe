// @resultsafe/core-fp-task/src/methods/expect.ts

import type { Task } from '@resultsafe/core-fp-task';

export const expect = <T>(task: Task<T>, msg: string): Promise<T> =>
  task().catch(() => {
    throw new Error(msg);
  });


