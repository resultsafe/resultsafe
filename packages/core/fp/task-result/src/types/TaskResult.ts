// @resultsafe/core-fp-task-result/src/types/TaskResult.ts

import type { Result } from '@resultsafe/core-fp-result';

export type TaskResult<T, E> = () => Promise<Result<T, E>>;


