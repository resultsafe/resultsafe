// __tests__/methods/map.v01.test.ts
import { map, None, Some } from '@resultsafe/core-fp-option';
import { type Option } from '@resultsafe/core-fp-option-shared';
import { describe, expect, it } from 'vitest';

describe('map', () => {
  it('✅ maps Some value', () => {
    const option: Option<number> = Some(5); // ✅ Option<number>
    const mapped = map(option, (x: number) => x * 2); // ✅ x — number
    expect(mapped).toEqual({ some: true, value: 10 });
  });

  it('❌ leaves None unchanged', () => {
    const option: Option<never> = None; // ✅ Option<never>
    const mapped = map(option, (x: never) => x); // ✅ x — never (не используется)
    expect(mapped).toEqual({ some: false });
  });
});


