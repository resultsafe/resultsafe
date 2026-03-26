// @resultsafe/core-fp-task/src/methods/__tests__/unwrapOrElse.test.ts
/**
 * Tests for `unwrapOrElse` method
 *
 * [EN] Resolves a Task or calls a fallback function if it rejects
 * [RU] Разрешает Task или вызывает функцию-резерв при ошибке
 */

import { unwrapOrElse } from '@resultsafe/core-fp-task';
import { describe, expect, it, vi } from 'vitest';

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

describe('fp-task :: unwrapOrElse ✅ / распаковка с функцией-резервом', () => {
  it('returns task result if it resolves 🎯', async () => {
    const t = immediateTask(42);
    const result = await unwrapOrElse(t, () => 0);
    expect(result).toBe(42);
  });

  it('calls fallback function if task rejects ❌', async () => {
    const t = rejectingTask(new Error('fail'));
    const fallback = vi.fn(() => 99);

    const result = await unwrapOrElse(t, fallback);
    expect(result).toBe(99);
    expect(fallback).toHaveBeenCalledOnce();
  });

  it('works with delayed tasks ⏱️', async () => {
    const t = delayTask('hello', 20);
    const result = await unwrapOrElse(t, () => 'default');
    expect(result).toBe('hello');
  });

  it('calls fallback for delayed rejected tasks ❌⏱️', async () => {
    const t = () =>
      new Promise<string>((_, rej) =>
        setTimeout(() => rej(new Error('fail')), 20),
      );
    const fallback = vi.fn(() => 'default');

    const result = await unwrapOrElse(t, fallback);
    expect(result).toBe('default');
    expect(fallback).toHaveBeenCalledOnce();
  });

  it('maintains type safety 🔐', async () => {
    const t: Task<number> = immediateTask(7);
    const result: number = await unwrapOrElse(t, () => 0);
    expect(result).toBe(7);
  });
});


