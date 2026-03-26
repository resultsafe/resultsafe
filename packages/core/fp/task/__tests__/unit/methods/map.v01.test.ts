// @resultsafe/core-fp-task/src/methods/__tests__/map.test.ts
/**
 * Tests for `map` method
 *
 * [EN] Covers transforming Task results, immediate and delayed tasks, and type safety
 * [RU] Покрытие трансформации результатов Task, немедленных и отложенных задач, типобезопасность
 */

import { map } from '@resultsafe/core-fp-task';
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

describe('fp-task :: map ✅ / трансформация задачи', () => {
  it('maps immediate task result correctly 🎯', async () => {
    const t = immediateTask(5);
    const mapped = map(t, (n) => n * 2);

    const result = await mapped();
    expect(result).toBe(10);
  });

  it('maps delayed task result correctly ⏱️', async () => {
    const t = delayTask(7, 20);
    const mapped = map(t, (n) => n + 3);

    const result = await mapped();
    expect(result).toBe(10);
  });

  it('propagates rejection from original task ❌', async () => {
    const t = rejectingTask(new Error('fail'));
    const mapped = map(t, (n) => n * 2);

    await expect(mapped()).rejects.toThrow('fail');
  });

  it('works with complex objects 🌐', async () => {
    const t = immediateTask({ id: 1, name: 'Alice' });
    const mapped = map(t, (obj) => ({ ...obj, active: true }));

    const result = await mapped();
    expect(result).toEqual({ id: 1, name: 'Alice', active: true });
  });

  it('maintains type safety 🔐', async () => {
    const t: Task<number> = immediateTask(7);
    const mapped: Task<string> = map(t, (n) => `value: ${n}`);

    const result: string = await mapped();
    expect(result).toBe('value: 7');
  });
});


