// @resultsafe/core-fp-task/src/methods/__tests__/expect.test.ts
/**
 * Tests for `expect` method
 *
 * [EN] Covers success, failure, and error message propagation
 * [RU] Покрытие успешного выполнения, отклонений и проброса сообщения ошибки
 */

import { expect as taskExpect } from '@resultsafe/core-fp-task';
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

describe('fp-task :: expect ✅ / проверка задачи', () => {
  it('resolves successful task and returns value 🎯', async () => {
    const t = immediateTask(42);
    const result = await taskExpect(t, 'should succeed');
    expect(result).toBe(42);
  });

  it('throws custom error message if task rejects ❌', async () => {
    const t = rejectingTask(new Error('original'));
    await expect(taskExpect(t, 'custom fail')).rejects.toThrow('custom fail');
  });

  it('works with complex types 🌐', async () => {
    const t: Task<{ id: number; name: string }> = immediateTask({
      id: 1,
      name: 'Alice',
    });
    const result = await taskExpect(t, 'failed fetching object');
    expect(result).toEqual({ id: 1, name: 'Alice' });
  });

  it('maintains type safety 🔐', async () => {
    const t: Task<number> = immediateTask(7);
    const result: number = await taskExpect(t, 'fail');
    expect(result).toBe(7);
  });
});


