// @resultsafe/core-fp-task-result/src/methods/allSettledSame.ts

import type { Result } from '@resultsafe/core-fp-result';
import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const allSettledSame =
  <T, E>(taskResults: readonly TaskResult<T, E>[]): TaskResult<T[], E> =>
  () =>
    Promise.allSettled(taskResults.map((tr) => tr())).then((results) => {
      const values: T[] = [];

      for (const result of results) {
        if (result.status === 'fulfilled') {
          if (!result.value.ok) {
            return result.value; // сразу возвращаем первую Err
          }
          values.push(result.value.value);
        } else {
          return { ok: false, error: result.reason } as Result<T[], E>;
        }
      }

      return { ok: true, value: values };
    });


