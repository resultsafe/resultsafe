// @resultsafe/core-fp-task/src/methods/__tests__/all.test.ts
/**
 * Tests for `all` method
 *
 * [EN] Detailed runtime tests covering:
 *  - all tasks resolve
 *  - tasks with delays preserve order
 *  - rejection short-circuits with a thrown error
 *  - empty array behaviour (explicit generic case)
 *  - heterogeneous tuple tasks preserve tuple types
 * [RU] Подробные runtime тесты, покрывающие:
 *  - все Task разрешаются
 *  - задачи с задержкой сохраняют порядок
 *  - при отклонении одна ошибка пробрасывается наружу
 *  - поведение для пустого массива (с явным generic)
 *  - разнотипные задачи (кортеж) сохраняют типы элементов
 *
 * ✅ Типобезопасность: tuple inference и строгие типы
 */

import { all } from '@resultsafe/core-fp-task';
import { describe, expect, it } from 'vitest';

// Task<T> = () => Promise<T>
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

describe('fp-task :: all ✅ / все', () => {
  it('resolves all immediate tasks -> returns array of values (EN) 🎯', async () => {
    const t1 = immediateTask(1);
    const t2 = immediateTask(2);
    const combined = all([t1, t2]);

    const result = await combined();
    expect(result).toEqual([1, 2]);
  });

  it('resolves delayed tasks and preserves order (EN) ⏱️', async () => {
    const t1 = delayTask(1, 30);
    const t2 = delayTask(2, 5);
    const combined = all([t1, t2]);

    const result = await combined();
    expect(result).toEqual([1, 2]);
  });

  it('rejects if any task rejects (EN) ❌ -> short-circuit', async () => {
    const t1 = delayTask(1, 5);
    const bad = rejectingTask(new Error('boom'), 10);
    const combined = all([t1, bad]);

    await expect(combined()).rejects.toThrow('boom');
  });

  it('empty array with explicit generic resolves to typed empty array (EN) 🧪', async () => {
    const typedEmpty = all([] as const); // Task<[]>
    const result = await typedEmpty();
    expect(result).toEqual([]);
  });

  it('works with union types (EN) 🔀', async () => {
    const a = immediateTask(1);
    const b = immediateTask('two');
    const combined = all([a, b]);
    const result = await combined();
    expect(result).toEqual([1, 'two']);
  });

  it('real-world scenario: heterogeneous tuple tasks (EN/RU) 🌐', async () => {
    const userTask = delayTask({ id: 1, name: 'Alice' }, 8);
    const settingsTask = delayTask({ theme: 'dark' }, 12);
    const flagTask = delayTask(true, 5);

    // ключевой момент: as const -> tuple inference
    const combined = all([userTask, settingsTask, flagTask] as const);

    const [user, settings, flag] = await combined();

    expect(user).toHaveProperty('name', 'Alice'); // { id, name }
    expect(settings.theme).toBe('dark'); // { theme }
    expect(flag).toBe(true); // boolean
  });
});


