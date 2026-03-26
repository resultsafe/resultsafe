// @resultsafe/core-fp-task/src/methods/__tests__/andThen.test.ts
/**
 * Tests for `andThen` method
 *
 * [EN] Covers chaining of Tasks, immediate and delayed execution, and error propagation
 * [RU] Покрытие цепочек Task, немедленное и отложенное выполнение, проброс ошибок
 */

import { andThen } from '@resultsafe/core-fp-task';
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
  <T = never>(err: unknown): Task<T> =>
  () =>
    Promise.reject(err);

describe('fp-task :: andThen ✅ / цепочка задач', () => {
  it('chains immediate tasks correctly 🎯', async () => {
    const t1 = immediateTask(2);
    const chained = andThen(t1, (v) => immediateTask(v * 3));

    const result = await chained();
    expect(result).toBe(6);
  });

  it('chains delayed tasks correctly ⏱️', async () => {
    const t1 = delayTask(5, 20);
    const chained = andThen(t1, (v) => delayTask(v + 10, 5));

    const result = await chained();
    expect(result).toBe(15);
  });

  it('propagates rejection from first task ❌', async () => {
    const t1 = rejectingTask(new Error('fail1'));
    const chained = andThen(t1, (v) => immediateTask(v * 2));

    await expect(chained()).rejects.toThrow('fail1');
  });

  it('propagates rejection from chained task ❌', async () => {
    const t1 = immediateTask(10);
    const chained = andThen(t1, () => rejectingTask(new Error('fail2')));

    await expect(chained()).rejects.toThrow('fail2');
  });

  it('works with complex real-world scenario 🌐', async () => {
    // Task: fetch user, then fetch settings based on user
    const fetchUser: Task<{ id: number; name: string }> = immediateTask({
      id: 1,
      name: 'Alice',
    });
    const fetchSettings = (user: {
      id: number;
      name: string;
    }): Task<{ theme: string }> =>
      immediateTask({ theme: user.id === 1 ? 'dark' : 'light' });

    const combined = andThen(fetchUser, fetchSettings);
    const result = await combined();
    expect(result).toEqual({ theme: 'dark' });
  });

  it('maintains type safety 🔐', async () => {
    const t1: Task<number> = immediateTask(7);
    const t2: Task<string> = andThen(t1, (n) => immediateTask(`value: ${n}`));

    const result: string = await t2(); // ✅ type-safe
    expect(result).toBe('value: 7');
  });
});


