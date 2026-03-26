// @resultsafe/core-fp-task/src/methods/__tests__/allSame.alt.test.ts
/**
 * Alternative tests for `allSame`
 *
 * [EN] Runtime tests for arrays of same-type Tasks
 * [RU] Тесты для массива однотипных Task
 *
 * ✅ Проверка:
 *  - все задачи разрешаются
 *  - порядок сохраняется
 *  - отклонение одной задачи -> reject
 *  - пустой массив
 *  - реальный сценарий с однотипными объектами
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

describe('fp-task :: allSame alternative tests ✅', () => {
  describe('✅ Successful resolution', () => {
    it('resolves multiple immediate tasks', async () => {
      const tasks = [immediateTask(10), immediateTask(20), immediateTask(30)];
      const result = await allSame(tasks)();
      expect(result).toEqual([10, 20, 30]);
    });

    it('resolves delayed tasks preserving order', async () => {
      const tasks = [delayTask(1, 15), delayTask(2, 5), delayTask(3, 10)];
      const result = await allSame(tasks)();
      expect(result).toEqual([1, 2, 3]);
    });

    it('real-world scenario: array of objects (same type)', async () => {
      const userTasks: Task<{ id: number; name: string }>[] = [
        delayTask({ id: 1, name: 'Alice' }, 5),
        delayTask({ id: 2, name: 'Bob' }, 10),
      ];

      const result = await allSame(userTasks)();
      expect(result[0]).toHaveProperty('name', 'Alice');
      expect(result[1]).toHaveProperty('name', 'Bob');
    });
  });

  describe('❌ Rejection handling', () => {
    it('rejects immediately if any task fails', async () => {
      const good = delayTask(1, 5);
      const bad = rejectingTask(new Error('fail'), 10);

      await expect(allSame([good, bad])()).rejects.toThrow('fail');
    });
  });

  describe('🧪 Empty array', () => {
    it('returns empty array for empty tasks', async () => {
      const result = await allSame([] as Task<number>[])();
      expect(result).toEqual([]);
    });
  });

  describe('🔢 Large arrays', () => {
    it('resolves larger arrays correctly', async () => {
      const tasks = Array.from({ length: 5 }, (_, i) => immediateTask(i));
      const result = await allSame(tasks)();
      expect(result).toEqual([0, 1, 2, 3, 4]);
    });
  });
});


