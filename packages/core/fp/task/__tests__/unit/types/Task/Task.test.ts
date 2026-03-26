// @resultsafe/core-fp-task/tests/task.test.ts

import type { Task } from '@resultsafe/core-fp-task';
import { describe, expect, it } from 'vitest';

// 🧪 Task<T> type tests
// [EN] Compile-time checks for type safety
// [RU] Проверки на этапе компиляции для типобезопасности

describe('Task<T> type', () => {
  it('should allow defining a Task<number>', () => {
    const task: Task<number> = () => Promise.resolve(42);

    return task().then((value) => {
      expect(value).toBe(42);
    });
  });

  it('should fail if Task<number> returns wrong type', () => {
    // @ts-expect-error [EN] Task<number> must return Promise<number>
    // [RU] Task<number> должен возвращать Promise<number>
    const badTask: Task<number> = () => Promise.resolve('not a number');

    expect(typeof badTask).toBe('function');
  });

  it('should support async/await style', async () => {
    const task: Task<string> = async () => 'hello';

    const value = await task();
    expect(value).toBe('hello');
  });
});

// 🚀 Real-world usage scenarios
// [EN] Demonstrates how Task<T> can be used in practice
// [RU] Демонстрация практического использования Task<T>

describe('Task<T> usage', () => {
  it('success case ✅', async () => {
    const fetchUser: Task<{ id: number; name: string }> = () =>
      Promise.resolve({ id: 1, name: 'Alice' });

    const user = await fetchUser();
    expect(user).toEqual({ id: 1, name: 'Alice' });
  });

  it('failure case ❌', async () => {
    const failingTask: Task<number> = () => Promise.reject(new Error('Boom!'));

    try {
      await failingTask();
      throw new Error('Should not reach here');
    } catch (err) {
      expect((err as Error).message).toBe('Boom!');
    }
  });

  it('composition of tasks 🔗', async () => {
    const task1: Task<number> = () => Promise.resolve(5);
    const task2: Task<number> = async () => {
      const value = await task1();
      return value * 2;
    };

    const result = await task2();
    expect(result).toBe(10);
  });

  it('parallel tasks 🏎️', async () => {
    const t1: Task<number> = () => Promise.resolve(1);
    const t2: Task<number> = () => Promise.resolve(2);
    const t3: Task<number> = () => Promise.resolve(3);

    const results = await Promise.all([t1(), t2(), t3()]);
    expect(results).toEqual([1, 2, 3]);
  });
});

// 📋 Summary
// [EN] This test suite validates that Task<T> is type-safe, supports success/failure, async/await, and composition.
// [RU] Этот набор тестов проверяет, что Task<T> типобезопасен, поддерживает успех/ошибку, async/await и композицию.


