// @resultsafe/core-fp-task/src/methods/race.ts

import type { Task } from '@resultsafe/core-fp-task';

export const race =
  <T>(task1: Task<T>, task2: Task<T>): Task<T> =>
  () =>
    Promise.race([task1(), task2()]);


