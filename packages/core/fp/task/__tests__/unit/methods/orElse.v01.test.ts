// @resultsafe/core-fp-task/src/methods/__tests__/orElse.test.ts
/**
 * Tests for `orElse` method
 *
 * [EN] Provides a fallback Task if the original Task rejects
 * [RU] Предоставляет резервный Task, если оригинальный Task отклоняется
 */

import { orElse } from '@resultsafe/core-fp-task';
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

describe('fp-task :: orElse ✅ / резервная задача', () => {
  it('returns original task result if it resolves 🎯', async () => {
    const t = immediateTask(42);
    const fallback = orElse(t, () => immediateTask(0));

    const result = await fallback();
    expect(result).toBe(42);
  });

  it('calls fallback if original task rejects ❌', async () => {
    const t = rejectingTask(new Error('fail'));
    const fallback = orElse(t, () => immediateTask(7));

    const result = await fallback();
    expect(result).toBe(7);
  });

  it('works with delayed tasks ⏱️', async () => {
    const t = delayTask(10, 20);
    const fallback = orElse(t, () => delayTask(99, 5));

    const result = await fallback();
    expect(result).toBe(10);
  });

  it('calls fallback if delayed task rejects ❌⏱️', async () => {
    const t = () =>
      new Promise<number>((_, rej) =>
        setTimeout(() => rej(new Error('fail')), 20),
      );
    const fallback = orElse(t, () => delayTask(99, 5));

    const result = await fallback();
    expect(result).toBe(99);
  });

  it('maintains type safety 🔐', async () => {
    const t: Task<number> = immediateTask(5);
    const fallback: Task<number> = orElse(t, () => immediateTask(0));

    const result: number = await fallback();
    expect(result).toBe(5);
  });
});


