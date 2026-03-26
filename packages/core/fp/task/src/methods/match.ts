// @resultsafe/core-fp-task/src/methods/match.ts

import type { Task } from '@resultsafe/core-fp-task';

export const match =
  <T, U>(
    task: Task<T>,
    handlers: {
      Ok: (value: T) => U;
      Err: (error: unknown) => U;
    },
  ): Task<U> =>
  () =>
    task().then(
      (value) => handlers.Ok(value),
      (error) => handlers.Err(error),
    );


