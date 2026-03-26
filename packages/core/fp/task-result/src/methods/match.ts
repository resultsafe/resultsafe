// @resultsafe/core-fp-task-result/src/methods/match.ts

import type { Result } from '@resultsafe/core-fp-result';

export const match = <T, E, U>(
  result: Result<T, E>,
  handlers: {
    Ok: (value: T) => U;
    Err: (error: E) => U;
  },
): U => (result.ok ? handlers.Ok(result.value) : handlers.Err(result.error));


