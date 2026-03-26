// @resultsafe/core-fp-task/src/methods/__tests__/unwrap.test.ts
/**
 * Tests for `unwrap` method
 *
 * [EN] Directly resolves a Task into a Promise
 * [RU] Прямое разрешение Task в Promise
 */

import { unwrap } from '@resultsafe/core-fp-task';
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

describe('fp-task :: unwrap ✅ / распаковка задачи', () => {
  it('resolves immediate task 🎯', async () => {
    const t = immediateTask(42);
    const result = await unwrap(t);
    expect(result).toBe(42);
  });

  it('resolves delayed task ⏱️', async () => {
    const t = delayTask('hello', 20);
    const result = await unwrap(t);
    expect(result).toBe('hello');
  });

  it('rejects if task rejects ❌', async () => {
    const t = rejectingTask(new Error('fail'));
    await expect(unwrap(t)).rejects.toThrow('fail');
  });

  it('maintains type safety 🔐', async () => {
    const t: Task<number> = immediateTask(7);
    const result: number = await unwrap(t);
    expect(result).toBe(7);
  });
});


