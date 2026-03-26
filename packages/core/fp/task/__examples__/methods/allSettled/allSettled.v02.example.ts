// @resultsafe/core-fp-task/src/methods/allSettled.ts
import type { Task } from '@resultsafe/core-fp-task';

export type Result<T> = { ok: true; value: T } | { ok: false; error: unknown };

/**
 * @description
 * [EN] Waits for all tasks to settle, capturing both fulfilled and rejected outcomes.
 * [RU] Ожидает завершения всех задач, фиксируя как успешные, так и ошибочные результаты.
 *
 * @param tasks - [EN] A readonly tuple of tasks of possibly different types
 *                [RU] Кортеж задач разных типов
 * @returns [EN] Task returning a tuple of Result objects corresponding to each input task
 *          [RU] Task, возвращающий кортеж объектов Result для каждой входной задачи
 */
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


