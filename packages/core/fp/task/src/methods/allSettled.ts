// @resultsafe/core-fp-task/src/methods/allSettled.ts

import { type Result } from '@resultsafe/core-fp-result';
import type { Task } from '@resultsafe/core-fp-task';

export const allSettled =
  <T, E = unknown>(tasks: readonly Task<T>[]): Task<Result<T, E>[]> =>
  () =>
    Promise.allSettled(tasks.map((task) => task())).then((results) =>
      results.map((result) =>
        result.status === 'fulfilled'
          ? { ok: true, value: result.value }
          : { ok: false, error: result.reason },
      ),
    );


