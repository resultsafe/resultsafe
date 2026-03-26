// @resultsafe/core-fp-task/src/methods/allSettledSame.ts

import type { Result } from '@resultsafe/core-fp-result';
import type { Task } from '@resultsafe/core-fp-task';

export const allSettledSame = <T, E = unknown>(
  tasks: readonly Task<T>[],
): Task<Result<T, E>[]> => {
  return () =>
    Promise.all(
      tasks.map((task) =>
        task()
          .then((value) => ({ ok: true as const, value }))
          .catch((error) => ({ ok: false as const, error })),
      ),
    );
};


