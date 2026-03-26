// @resultsafe/core-fp-task/src/methods/__tests__/allSettled.test.ts
/**
 * Tests for `allSettled` method
 *
 * [EN] Covers resolved, rejected, delayed, and empty tasks
 * [RU] Покрытие успешных, отклонённых, задержанных и пустых задач
 */

import type { Result } from '@resultsafe/core-fp-result';
import { allSettled } from '@resultsafe/core-fp-task';
import { describe, expect, it } from 'vitest';

type Task<T> = () => Promise<T>;

const delayTask =
  <T>(value: T, ms = 10): Task<T> =>
  () =>
    new Promise((res) => setTimeout(() => res(value), ms));

const immediateTask =
  <T>(value: T): Task<T> =>
  () =>
    Promise.resolve(value);

const rejectingTask =
  <T = never>(err: unknown, ms = 0): Task<T> =>
  () =>
    new Promise((_, rej) => setTimeout(() => rej(err), ms));

describe('fp-task :: allSettled ✅ / все результаты', () => {
  it('resolves all immediate tasks -> returns array of Result<T, E> 🎯', async () => {
    const combined = allSettled([immediateTask(1), immediateTask(2)]);
    const results = await combined(); // ✅ распаковываем Task

    const r0 = results[0]!;
    const r1 = results[1]!;

    expect(r0.ok).toBe(true);
    if (r0.ok) expect(r0.value).toBe(1);

    expect(r1.ok).toBe(true);
    if (r1.ok) expect(r1.value).toBe(2);
  });

  it('resolves delayed tasks and preserves order ⏱️', async () => {
    const combined = allSettled([delayTask(1, 30), delayTask(2, 5)]);
    const results = await combined();

    const r0 = results[0]!;
    const r1 = results[1]!;

    expect(r0.ok).toBe(true);
    if (r0.ok) expect(r0.value).toBe(1);

    expect(r1.ok).toBe(true);
    if (r1.ok) expect(r1.value).toBe(2);
  });

  it('captures rejected tasks ❌ without throwing', async () => {
    const combined = allSettled([
      delayTask(1, 5),
      rejectingTask(new Error('fail'), 10),
    ]);
    const results = await combined();

    const r0 = results[0]!;
    const r1 = results[1]!;

    expect(r0.ok).toBe(true);
    if (r0.ok) expect(r0.value).toBe(1);

    expect(r1.ok).toBe(false);
    if (!r1.ok) {
      expect(r1.error).toBeInstanceOf(Error);
      expect((r1.error as Error).message).toBe('fail');
    }
  });

  it('empty array returns empty Result array 🧪', async () => {
    const combined = allSettled([] as Task<number>[]);
    const results = await combined();
    expect(results).toEqual([]);
  });

  it('works with larger arrays 🔢', async () => {
    const tasks = Array.from({ length: 5 }, (_, i) => immediateTask(i));
    const results = await allSettled(tasks)();
    const values = results.map((r) => (r.ok ? r.value : null));
    expect(values).toEqual([0, 1, 2, 3, 4]);
  });

  it('real-world scenario: mixed objects and errors 🌐', async () => {
    const tasks: Task<{ id: number; name: string }>[] = [
      immediateTask({ id: 1, name: 'Alice' }),
      rejectingTask(new Error('fail1')),
      immediateTask({ id: 2, name: 'Bob' }),
      rejectingTask(new Error('fail2')),
    ];

    const combined: Task<Result<{ id: number; name: string }, unknown>[]> =
      allSettled(tasks);

    // 🔹 Важно: сначала await Task
    const results = await combined();

    // Теперь TypeScript понимает, что это массив Result<T,E>[]
    const r0 = results[0]!;
    const r1 = results[1]!;
    const r2 = results[2]!;
    const r3 = results[3]!;

    expect(r0.ok).toBe(true);
    if (r0.ok) expect(r0.value).toEqual({ id: 1, name: 'Alice' });

    expect(r1.ok).toBe(false);
    if (!r1.ok) expect((r1.error as Error).message).toBe('fail1');

    expect(r2.ok).toBe(true);
    if (r2.ok) expect(r2.value).toEqual({ id: 2, name: 'Bob' });

    expect(r3.ok).toBe(false);
    if (!r3.ok) expect((r3.error as Error).message).toBe('fail2');
  });
});


