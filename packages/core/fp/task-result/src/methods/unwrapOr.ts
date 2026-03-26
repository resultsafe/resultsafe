// @resultsafe/core-fp-task-result/src/methods/unwrapOr.ts

import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const unwrapOr = <T, E>(
  taskResult: TaskResult<T, E>,
  defaultValue: T,
): Promise<T> =>
  taskResult().then((result) => (result.ok ? result.value : defaultValue));


