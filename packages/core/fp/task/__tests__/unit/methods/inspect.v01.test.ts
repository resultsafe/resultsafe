// @resultsafe/core-fp-task/src/methods/__tests__/inspect.test.ts
/**
 * Tests for `inspect` method
 *
 * [EN] Covers immediate, delayed tasks and side-effect inspection
 * [RU] Покрытие немедленных, отложенных задач и побочных эффектов
 */

import { inspect } from '@resultsafe/core-fp-task';
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

describe('fp-task :: inspect ✅ / инспекция задачи', () => {
  it('calls fn with resolved value and returns same value 🎯', async () => {
    const spy = vi.fn();
    const t = immediateTask(42);
    const inspected = inspect(t, spy);

    const result = await inspected();
    expect(result).toBe(42);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(42);
  });

  it('works with delayed tasks ⏱️', async () => {
    const spy = vi.fn();
    const t = delayTask('hello', 20);
    const inspected = inspect(t, spy);

    const result = await inspected();
    expect(result).toBe('hello');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('hello');
  });

  it('does not modify returned value 🔄', async () => {
    const t = immediateTask({ id: 1, name: 'Alice' });
    const inspected = inspect(t, (v) => {
      // side-effect only
      v.id = 999;
    });

    const result = await inspected();
    // объект мутирован, но это побочный эффект, inspect возвращает именно результат Task
    expect(result).toEqual({ id: 999, name: 'Alice' });
  });

  it('maintains type safety 🔐', async () => {
    const t: Task<number> = immediateTask(7);
    const inspected: Task<number> = inspect(t, (n) => console.log(n));
    const result: number = await inspected();
    expect(result).toBe(7);
  });
});


