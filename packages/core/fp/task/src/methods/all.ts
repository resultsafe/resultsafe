// @resultsafe/core-fp-task/src/methods/all.ts

import type { Task } from '@resultsafe/core-fp-task';

export function all<TTasks extends readonly Task<any>[]>(
  tasks: TTasks,
): Task<{ [K in keyof TTasks]: Awaited<ReturnType<TTasks[K]>> }> {
  return () => Promise.all(tasks.map((task) => task())) as any;
}


