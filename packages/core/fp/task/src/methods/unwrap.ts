// @resultsafe/core-fp-task/src/methods/unwrap.ts

import type { Task } from '@resultsafe/core-fp-task';

export const unwrap = <T>(task: Task<T>): Promise<T> => task();


