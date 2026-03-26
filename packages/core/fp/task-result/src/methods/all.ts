// @resultsafe/core-fp-task-result/src/methods/all.ts

import { isOk } from '@resultsafe/core-fp-result';
import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const all =
  <T, E>(taskResults: readonly TaskResult<T, E>[]): TaskResult<T[], E> =>
  () =>
    Promise.all(taskResults.map((tr) => tr())).then((results) => {
      const firstError = results.find((r) => !r.ok);
      if (firstError) {
        return { ok: false, error: firstError.error };
      }

      // type guard isOk гарантирует безопасный доступ к value
      const values = results.filter(isOk).map((r) => r.value);
      return { ok: true, value: values };
    });


