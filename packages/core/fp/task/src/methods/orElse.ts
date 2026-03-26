// @resultsafe/core-fp-task/src/methods/orElse.ts

import type { Task } from '@resultsafe/core-fp-task';

export const orElse =
  <T>(task: Task<T>, fn: () => Task<T>): Task<T> =>
  () =>
    task().catch(() => fn()()); // ✅ вызываем fn(), затем () → получаем Promise<T>


