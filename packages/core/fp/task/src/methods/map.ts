// @resultsafe/core-fp-task/src/methods/map.ts

import type { Task } from '@resultsafe/core-fp-task';

export const map =
  <T, U>(task: Task<T>, fn: (value: T) => U): Task<U> =>
  () =>
    task().then(fn);


