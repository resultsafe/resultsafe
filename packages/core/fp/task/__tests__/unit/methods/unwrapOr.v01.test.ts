// @resultsafe/core-fp-task/src/methods/__tests__/unwrapOr.test.ts
/**
 * Tests for `unwrapOr` method
 *
 * [EN] Resolves a Task or returns a default value if it rejects
 * [RU] Разрешает Task или возвращает значение по умолчанию при ошибке
 */

import { unwrapOr } from '@resultsafe/core-fp-task';
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

describe('fp-task :: unwrapOr ✅ / распаковка с дефолтом', () => {
  it('returns task result if it resolves 🎯', async () => {
    const t = immediateTask(42);
    const result = await unwrapOr(t, 0);
    expect(result).toBe(42);
  });

  it('returns default value if task rejects ❌', async () => {
    const t = rejectingTask(new Error('fail'));
    const result = await unwrapOr(t, 99);
    expect(result).toBe(99);
  });

  it('works with delayed tasks ⏱️', async () => {
    const t = delayTask('hello', 20);
    const result = await unwrapOr(t, 'default');
    expect(result).toBe('hello');
  });

  it('returns default for delayed rejected tasks ❌⏱️', async () => {
    const t = () =>
      new Promise<string>((_, rej) =>
        setTimeout(() => rej(new Error('fail')), 20),
      );
    const result = await unwrapOr(t, 'default');
    expect(result).toBe('default');
  });

  it('maintains type safety 🔐', async () => {
    const t: Task<number> = immediateTask(7);
    const result: number = await unwrapOr(t, 0);
    expect(result).toBe(7);
  });
});


