// @resultsafe/core-fp-task/src/methods/__tests__/inspectErr.test.ts
/**
 * Tests for `inspectErr` method
 *
 * [EN] Covers tasks that reject and ensures fn is called on error
 * [RU] Покрытие задач с отклонением и проверка вызова fn при ошибке
 */

import { inspectErr } from '@resultsafe/core-fp-task';
import { describe, expect, it, vi } from 'vitest';

type Task<T> = () => Promise<T>;

const immediateTask =
  <T>(value: T): Task<T> =>
  () =>
    Promise.resolve(value);
const rejectingTask =
  <T = never>(err: unknown): Task<T> =>
  () =>
    Promise.reject(err);

describe('fp-task :: inspectErr ✅ / инспекция ошибок', () => {
  it('calls fn on rejected task and rethrows ❌', async () => {
    const spy = vi.fn();
    const t = rejectingTask(new Error('fail'));
    const inspected = inspectErr(t, spy);

    await expect(inspected()).rejects.toThrow('fail');

    expect(spy).toHaveBeenCalledOnce();

    // 🔹 безопасный доступ к первому аргументу
    const firstCall = spy.mock.calls[0]!;
    const calledWith = firstCall[0];
    expect(calledWith).toBeInstanceOf(Error);
    expect((calledWith as Error).message).toBe('fail');
  });

  it('does not call fn on successful task ✅', async () => {
    const spy = vi.fn();
    const t = immediateTask(42);
    const inspected = inspectErr(t, spy);

    const result = await inspected();
    expect(result).toBe(42);
    expect(spy).not.toHaveBeenCalled();
  });

  it('works with delayed rejected task ⏱️', async () => {
    const spy = vi.fn();
    const t = () =>
      new Promise<number>((_, rej) =>
        setTimeout(() => rej(new Error('timeout')), 20),
      );
    const inspected = inspectErr(t, spy);

    await expect(inspected()).rejects.toThrow('timeout');
    expect(spy).toHaveBeenCalledOnce();
  });

  it('maintains type safety 🔐', async () => {
    const t: Task<number> = immediateTask(7);
    const inspected: Task<number> = inspectErr(t, (err) => console.log(err));
    const result: number = await inspected();
    expect(result).toBe(7);
  });
});


