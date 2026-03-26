// @resultsafe/core-fp-task-result/src/methods/orElse.ts

import type { Result } from '@resultsafe/core-fp-result';
import { isErr } from '@resultsafe/core-fp-result';
import type { TaskResult } from '../types/TaskResult.js';

export const orElse =
  <T, E, F>(
    taskResult: TaskResult<T, E>,
    fn: (error: E) => TaskResult<T, F>,
  ): TaskResult<T, F> =>
  () =>
    taskResult().then((result) =>
      isErr(result) ? fn(result.error)() : (result as Result<T, F>),
    );


