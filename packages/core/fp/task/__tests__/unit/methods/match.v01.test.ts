// @resultsafe/core-fp-task/src/methods/__tests__/match.test.ts
/**
 * Tests for `match` method
 *
 * [EN] Covers mapping success and error cases to custom handlers
 * [RU] Покрытие обработки успешного и ошибочного результата через кастомные обработчики
 */

import { match } from '@resultsafe/core-fp-task';
import { describe, expect, it } from 'vitest';

type Task<T> = () => Promise<T>;

const immediateTask =
  <T>(value: T): Task<T> =>
  () =>
    Promise.resolve(value);
const rejectingTask =
  <T = never>(err: unknown): Task<T> =>
  () =>
    Promise.reject(err);
const delayTask =
  <T>(value: T, ms = 10): Task<T> =>
  () =>
    new Promise((res) => setTimeout(() => res(value), ms));

describe('fp-task :: match ✅ / сопоставление результата', () => {
  it('calls Ok handler on success 🎯', async () => {
    const t = immediateTask(5);
    const handled = match(t, {
      Ok: (v) => v * 2,
      Err: () => 0,
    });

    const result = await handled();
    expect(result).toBe(10);
  });

  it('calls Err handler on rejection ❌', async () => {
    const t = rejectingTask(new Error('fail'));
    const handled = match(t, {
      Ok: (v: number) => v * 2,
      Err: (err) => (err instanceof Error ? 0 : 0), // теперь возвращаем number
    });

    const result = await handled();
    expect(result).toBe('fail');
  });

  it('works with delayed tasks ⏱️', async () => {
    const t = delayTask('hello', 20);
    const handled = match(t, {
      Ok: (v) => v.toUpperCase(),
      Err: () => 'error',
    });

    const result = await handled();
    expect(result).toBe('HELLO');
  });

  it('works with complex objects 🌐', async () => {
    const t = immediateTask({ id: 1, name: 'Alice' });
    const handled = match(t, {
      Ok: (obj) => ({ ...obj, active: true }),
      Err: () => ({ id: 0, name: 'unknown', active: false }),
    });

    const result = await handled();
    expect(result).toEqual({ id: 1, name: 'Alice', active: true });
  });

  it('maintains type safety 🔐', async () => {
    const t: Task<number> = immediateTask(7);
    const handled: Task<string> = match(t, {
      Ok: (n) => `value: ${n}`,
      Err: (err) => `error: ${String(err)}`,
    });

    const result: string = await handled();
    expect(result).toBe('value: 7');
  });
});


