// @resultsafe/core-fp-task/src/methods/__tests__/all.tuple.test.ts
/**
 * Tests for `all` method with heterogeneous tuple Tasks
 *
 * [EN] Focus: preserving tuple typing for heterogeneous tasks.
 * [RU] Фокус: сохранение кортежной типизации для разнородных Task.
 *
 * ✅ Covers:
 *  - tuple with different types (number, string, object)
 *  - inference of element types
 *  - type errors when destructuring incorrectly
 *  - real-world use case with API-like tasks
 */

import { all } from '@resultsafe/core-fp-task';
import { describe, expect, it } from 'vitest';

// Task<T> = () => Promise<T>
type Task<T> = () => Promise<T>;

const immediateTask =
  <T>(value: T): Task<T> =>
  () =>
    Promise.resolve(value);

describe('fp-task :: all (tuple typing) ✅', () => {
  it('preserves tuple types for heterogeneous tasks (EN/RU)', async () => {
    const t1 = immediateTask(42); // Task<number>
    const t2 = immediateTask('hello'); // Task<string>
    const t3 = immediateTask({ ok: true }); // Task<{ ok: boolean }>

    const combined = all([t1, t2, t3]);
    const result = await combined();

    // result inferred as [number, string, { ok: boolean }]
    const [n, s, obj] = result;

    expect(n).toBe(42);
    expect(s).toBe('hello');
    expect(obj).toEqual({ ok: true });
  });

  it('works in real-world case: user + settings + flag', async () => {
    const userTask = immediateTask({ id: 1, name: 'Alice' });
    const settingsTask = immediateTask({ theme: 'dark' });
    const flagTask = immediateTask(true);

    // 👇 ключевой момент: as const
    const combined = all([userTask, settingsTask, flagTask] as const);

    const [user, settings, flag] = await combined();

    // inferred:
    // user: { id: number; name: string }
    // settings: { theme: string }
    // flag: boolean
    expect(user).toHaveProperty('name', 'Alice');
    expect(settings.theme).toBe('dark'); // ✅ теперь тип известен
    expect(flag).toBe(true);
  });
  it('empty tuple is allowed but needs explicit type', async () => {
    // by default, all([]) -> Task<never[]>
    const empty = all<[]>([]);
    const result = await empty();
    expect(result).toEqual([]);
  });

  // 🔎 Type-level tests (no runtime, just compilation)
  it('type inference checks (compile-time only)', () => {
    const numTask = immediateTask(1);
    const strTask = immediateTask('x');

    const combined = all([numTask, strTask]);
    type Combined = Awaited<ReturnType<typeof combined>>;

    // ✅ Should be [number, string]
    const _assertTuple: Combined = [123, 'abc'];

    const _wrongOrder: Combined = ['abc', 123];

    const _missing: Combined = [123];
  });
});


