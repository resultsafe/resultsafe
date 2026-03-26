// __tests__/objects/merge.test.ts
import { merge } from '@resultsafe/core-fp-shared';
import { describe, expect, it } from 'vitest';

describe('merge function', () => {
  it('✅ merges objects deeply / глубоко объединяет объекты', () => {
    const target = { a: 1, b: { c: 2 } };
    const source = { b: { d: 3 }, e: 4 };

    const result = merge(target, source);

    expect(result).toEqual({
      a: 1,
      b: { c: 2, d: 3 },
      e: 4,
    });
  });

  it('✅ replaces arrays / заменяет массивы', () => {
    const target = { arr: [1, 2] };
    const source = { arr: [3, 4] };

    const result = merge(target, source);

    expect(result.arr).toEqual([3, 4]);
  });

  it('✅ handles numeric keys / обрабатывает числовые ключи', () => {
    const target = { 0: 'a' };
    const source = { 0: 'b', 1: 'c' };

    const result = merge(target, source);

    expect(result[0]).toBe('b');
    expect(result[1]).toBe('c');
  });
});


