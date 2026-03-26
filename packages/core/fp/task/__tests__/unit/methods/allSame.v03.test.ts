// @resultsafe/core-fp-task/src/methods/__tests__/allSame.functional.test.ts
/**
 * Functional-style tests for `allSame`
 *
 * [EN] Tests dynamic task generation, mapping, and order preservation
 * [RU] Тесты с динамическим созданием задач, проверка порядка и ошибок
 */

import { allSame } from '@resultsafe/core-fp-task';
import { describe, expect, it } from 'vitest';

type Task<T> = () => Promise<T>;

// helpers
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

describe('fp-task :: allSame functional-style ✅', () => {
  it('dynamically generates tasks and resolves in order', async () => {
    const numbers = [5, 10, 15];
    const tasks = numbers.map((n) => delayTask(n, n)); // delay proportional to value

    const result = await allSame(tasks)();
    expect(result).toEqual(numbers); // order preserved
  });

  it('works with mapped transformation tasks', async () => {
    const base = [1, 2, 3];
    const tasks = base.map((n) => immediateTask(n * 2));

    const result = await allSame(tasks)();
    expect(result).toEqual([2, 4, 6]);
  });

  it('handles large number of tasks correctly', async () => {
    const tasks = Array.from({ length: 50 }, (_, i) => immediateTask(i));
    const result = await allSame(tasks)();
    expect(result.length).toBe(50);
    expect(result[0]).toBe(0);
    expect(result[49]).toBe(49);
  });

  it('short-circuits on first rejection', async () => {
    const tasks: Task<number>[] = [
      delayTask(1, 5),
      rejectingTask(new Error('oops'), 10),
      delayTask(2, 15),
    ];

    await expect(allSame(tasks)()).rejects.toThrow('oops');
  });

  it('returns empty array for empty input', async () => {
    const result = await allSame([] as Task<string>[])();
    expect(result).toEqual([]);
  });

  it('works with complex objects of same type', async () => {
    const tasks: Task<{ id: number; val: string }>[] = [
      immediateTask({ id: 1, val: 'A' }),
      immediateTask({ id: 2, val: 'B' }),
    ];

    const result = await allSame(tasks)();
    expect(result[0]).toEqual({ id: 1, val: 'A' });
    expect(result[1]).toEqual({ id: 2, val: 'B' });
  });
});


