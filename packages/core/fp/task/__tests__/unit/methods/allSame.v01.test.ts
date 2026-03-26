// @resultsafe/core-fp-task/src/methods/__tests__/allSame.test.ts
/**
 * Tests for `allSame` method
 *
 * [EN] Runtime tests for arrays of same-type Tasks
 * [RU] Тесты для массива однотипных Task
 *
 * ✅ Проверка:
 *  - все задачи разрешаются
 *  - порядок сохраняется
 *  - отклонение одной задачи -> reject
 *  - пустой массив
 */

import { allSame } from '@resultsafe/core-fp-task';
import { describe, expect, it } from 'vitest';

type Task<T> = () => Promise<T>;

const delayTask =
  <T>(value: T, ms = 10): Task<T> =>
  () =>
    new Promise((res) => setTimeout(() => res(value), ms));

const immediateTask =
  <T>(value: T): Task<T> =>
  () =>
    Promise.resolve(value);

const rejectingTask =
  <T = never>(err: unknown, ms = 0): Task<T> =>
  () =>
    new Promise((_, rej) => setTimeout(() => rej(err), ms));

describe('fp-task :: allSame ✅ / однотипные', () => {
  it('resolves all immediate tasks -> returns array of values 🎯', async () => {
    const t1 = immediateTask(1);
    const t2 = immediateTask(2);
    const combined = allSame([t1, t2]);

    const result = await combined();
    expect(result).toEqual([1, 2]);
  });

  it('resolves delayed tasks and preserves order ⏱️', async () => {
    const t1 = delayTask(1, 30);
    const t2 = delayTask(2, 5);
    const combined = allSame([t1, t2]);

    const result = await combined();
    expect(result).toEqual([1, 2]); // порядок сохраняется
  });

  it('rejects if any task rejects ❌', async () => {
    const t1 = delayTask(1, 5);
    const bad = rejectingTask(new Error('boom'), 10);
    const combined = allSame([t1, bad]);

    await expect(combined()).rejects.toThrow('boom');
  });

  it('empty array resolves to empty array 🧪', async () => {
    const combined = allSame([] as Task<number>[]);
    const result = await combined();
    expect(result).toEqual([]);
  });

  it('works with larger arrays 🔢', async () => {
    const tasks = Array.from({ length: 5 }, (_, i) => immediateTask(i));
    const combined = allSame(tasks);
    const result = await combined();
    expect(result).toEqual([0, 1, 2, 3, 4]);
  });
});


