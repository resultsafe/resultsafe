// @resultsafe/core-fp-task/src/methods/unwrapOr.ts

import type { Task } from '@resultsafe/core-fp-task';

export const unwrapOr = <T>(task: Task<T>, defaultValue: T): Promise<T> =>
  task().catch(() => defaultValue);


