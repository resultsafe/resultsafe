// __tests__/methods/fromNullable.test.ts

import { fromNullable } from '@resultsafe/core-fp-option';
import { describe, expect, it } from 'vitest';

describe('fromNullable', () => {
  it('✅ converts non-null value to Some / преобразует не-null значение в Some', () => {
    const value: string | null = 'hello';
    const option = fromNullable(value);

    expect(option).toEqual({ some: true, value: 'hello' });
  });

  it('❌ converts null to None / преобразует null в None', () => {
    const value: string | null = null;
    const option = fromNullable(value);

    expect(option).toEqual({ some: false });
  });

  it('❌ converts undefined to None / преобразует undefined в None', () => {
    const value: number | undefined = undefined;
    const option = fromNullable(value);

    expect(option).toEqual({ some: false });
  });

  it('✅ handles zero as Some / обрабатывает ноль как Some', () => {
    const value: number | null = 0;
    const option = fromNullable(value);

    expect(option).toEqual({ some: true, value: 0 });
  });

  it('✅ handles empty string as Some / обрабатывает пустую строку как Some', () => {
    const value: string | null = '';
    const option = fromNullable(value);

    expect(option).toEqual({ some: true, value: '' });
  });

  it('✅ handles false as Some / обрабатывает false как Some', () => {
    const value: boolean | null = false;
    const option = fromNullable(value);

    expect(option).toEqual({ some: true, value: false });
  });

  it('✅ handles NaN as Some / обрабатывает NaN как Some', () => {
    const value: number | null = NaN;
    const option = fromNullable(value);

    expect(option).toEqual({ some: true, value: NaN });
  });
});


