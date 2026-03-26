// @resultsafe/core-fp-task/src/methods/unwrapOrElse.ts

import type { Task } from '@resultsafe/core-fp-task';

export const unwrapOrElse = <T>(task: Task<T>, fn: () => T): Promise<T> =>
  task().catch(fn);


