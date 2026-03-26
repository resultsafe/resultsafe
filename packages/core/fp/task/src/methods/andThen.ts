// @resultsafe/core-fp-task/src/methods/andThen.ts

import type { Task } from '@resultsafe/core-fp-task';

export const andThen =
  <T, U>(task: Task<T>, fn: (value: T) => Task<U>): Task<U> =>
  () =>
    task()
      .then(fn)
      .then((chained) => chained());


