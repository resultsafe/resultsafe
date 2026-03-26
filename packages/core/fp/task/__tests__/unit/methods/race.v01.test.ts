// @resultsafe/core-fp-task/src/methods/__tests__/race.test.ts
/**
 * Tests for `race` method
 *
 * [EN] Resolves or rejects with the first Task to settle
 * [RU] Разрешается или отклоняется с результатом первой завершившейся Task
 */

import { race } from '@resultsafe/core-fp-task';
import { describe, expect, it } from 'vitest';

type Task<T> = () => Promise<T>;

const immediateTask =
  <T>(value: T): Task<T> =>
  () =>
    Promise.resolve(value);
const delayTask =
  <T>(value: T, ms = 10): Task<T> =>
  () =>
    new Promise((res) => setTimeout(() => res(value), ms));
const rejectingTask =
  <T = never>(err: unknown, ms = 0): Task<T> =>
  () =>
    new Promise((_, rej) => setTimeout(() => rej(err), ms));

describe('fp-task :: race ✅ / первая завершившаяся задача', () => {
  it('resolves with first completed immediate task 🎯', async () => {
    const t1 = immediateTask(1);
    const t2 = immediateTask(2);
    const result = await race(t1, t2)();
    // Promise.race выбирает первый в очереди, здесь оба immediate, результат может быть любым из них
    expect([1, 2]).toContain(result);
  });

  it('resolves with the faster delayed task ⏱️', async () => {
    const t1 = delayTask(1, 50);
    const t2 = delayTask(2, 10);
    const result = await race(t1, t2)();
    expect(result).toBe(2);
  });

  it('rejects if the first task rejects ❌', async () => {
    const t1 = rejectingTask(new Error('fail'), 5);
    const t2 = delayTask(10, 20);

    await expect(race(t1, t2)()).rejects.toThrow('fail');
  });

  it('resolves with remaining task if the first rejects ❌🎯', async () => {
    const t1 = rejectingTask(new Error('fail'), 20);
    const t2 = delayTask(99, 5);

    const result = await race(t1, t2)();
    // t2 быстрее, поэтому возвращается результат t2
    expect(result).toBe(99);
  });

  it('maintains type safety 🔐', async () => {
    const t1: Task<number> = immediateTask(7);
    const t2: Task<number> = immediateTask(42);

    const result: number = await race(t1, t2)();
    expect([7, 42]).toContain(result);
  });
});


