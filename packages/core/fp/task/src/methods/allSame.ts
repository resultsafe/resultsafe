// @resultsafe/core-fp-task/src/methods/allSame.ts

import type { Task } from '@resultsafe/core-fp-task';

export const allSame =
  <T>(tasks: readonly Task<T>[]): Task<T[]> =>
  () =>
    Promise.all(tasks.map((task) => task()));


