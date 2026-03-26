// @resultsafe/core-fp-task/src/methods/inspect.ts

import type { Task } from '@resultsafe/core-fp-task';

export const inspect =
  <T>(task: Task<T>, fn: (value: T) => void): Task<T> =>
  () =>
    task().then((value) => {
      fn(value);
      return value;
    });


