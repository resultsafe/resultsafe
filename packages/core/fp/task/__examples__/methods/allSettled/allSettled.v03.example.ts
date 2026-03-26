import type { Task } from '@resultsafe/core-fp-task';

export type Result<T> = { ok: true; value: T } | { ok: false; error: unknown };

export function allSettled<TTasks extends readonly Task<any>[]>(
  tasks: TTasks,
): Task<{ [K in keyof TTasks]: Result<Awaited<ReturnType<TTasks[K]>>> }> {
  return () =>
    Promise.allSettled(tasks.map((task) => task())).then((results) =>
      results.map((result) =>
        result.status === 'fulfilled'
          ? { ok: true, value: result.value }
          : { ok: false, error: result.reason },
      ),
    ) as any; // TS-safe assertion для кортежа
}


