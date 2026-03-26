// @resultsafe/core-fp-task/src/methods/inspectErr.ts

import type { Task } from '@resultsafe/core-fp-task';

export const inspectErr =
  <T>(task: Task<T>, fn: (error: unknown) => void): Task<T> =>
  () =>
    task().catch((error) => {
      fn(error);
      throw error;
    });


