import type { TaskResult } from '@resultsafe/core-fp-task-result';

export const taskMatch = <T, E, U>(
  taskResult: TaskResult<T, E>,
  handlers: {
    Ok: (value: T) => U;
    Err: (error: E) => U;
  },
): Promise<U> =>
  taskResult().then((result) =>
    result.ok ? handlers.Ok(result.value) : handlers.Err(result.error),
  );


