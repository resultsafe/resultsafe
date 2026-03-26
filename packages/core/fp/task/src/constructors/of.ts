// @resultsafe/core-fp-task/src/constructors/of.ts

import type { Task } from '@resultsafe/core-fp-task';

export const of =
  <T>(value: T): Task<T> =>
  () =>
    Promise.resolve(value);


