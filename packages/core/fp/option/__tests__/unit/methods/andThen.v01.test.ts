// __tests__/methods/andThen.test.ts
import { andThen, None, Some } from '@resultsafe/core-fp-option';
import { type Option } from '@resultsafe/core-fp-option-shared';
import { describe, expect, it } from 'vitest';

describe('andThen', () => {
  it('✅ chains Some to Some', () => {
    const option = Some(5);
    const chained = andThen(option, (x) => Some(x * 2));

    expect(chained).toEqual({ some: true, value: 10 });
  });

  it('✅ chains Some to None', () => {
    const option = Some(5);
    const chained = andThen(option, (_) => None);

    expect(chained).toEqual({ some: false });
  });

  it('❌ leaves None unchanged', () => {
    const option = None; // ✅ Option<never>
    const chained = andThen(option, (_num: never): Option<string> => {
      // ✅ _num — never — никогда не будет вызван
      return None;
    });

    expect(chained).toEqual({ some: false });
  });

  it('✅ handles complex chaining with conditions', () => {
    const option1 = Some(10);
    const chained1 = andThen(option1, (x) =>
      x > 5 ? Some(x.toString()) : None,
    );

    expect(chained1).toEqual({ some: true, value: '10' });

    const option2 = Some(3);
    const chained2 = andThen(option2, (x) =>
      x > 5 ? Some(x.toString()) : None,
    );

    expect(chained2).toEqual({ some: false });
  });

  it('✅ preserves type safety in chaining', () => {
    const option = Some(42); // ✅ Option<number>

    const result = andThen(option, (num: number): Option<string> => {
      return num > 0 ? Some(num.toString()) : None;
    });

    if (result.some === true) {
      expect(typeof result.value).toBe('string');
      expect(result.value).toBe('42');
    } else {
      expect.fail('Expected Some, got None');
    }
  });

  it('❌ handles None with type safety', () => {
    const option = None; // ✅ Option<never>

    const result = andThen(option, (_num: never): Option<string> => {
      // ✅ _num — never — никогда не будет вызван
      return None;
    });

    expect(result).toEqual({ some: false });
  });
});


