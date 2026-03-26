// @resultsafe/core-fp-task-result/src/methods/unwrapOrElse.ts

import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const unwrapOrElse = <T, E>(
  taskResult: TaskResult<T, E>,
  fn: (error: E) => T,
): Promise<T> =>
  taskResult().then((result) => (result.ok ? result.value : fn(result.error)));


