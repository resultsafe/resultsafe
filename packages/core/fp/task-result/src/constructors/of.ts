// @resultsafe/core-fp-task-result/src/constructors/of.ts

import { ok } from '@resultsafe/core-fp-result';
import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const of =
  <T, E = never>(value: T): TaskResult<T, E> =>
  () =>
    Promise.resolve(ok(value));


