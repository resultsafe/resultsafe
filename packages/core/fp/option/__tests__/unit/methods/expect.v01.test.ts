// __tests__/methods/expect.v01.test.ts
import { expect as expectMethod, None, Some } from '@resultsafe/core-fp-option';
import { describe, expect, it } from 'vitest';

describe('expect', () => {
  // ---------------------
  // ✅ some case
  // ---------------------
  it('✅ returns value from some', () => {
    const option = Some(42);
    const value = expectMethod(option, 'Expected some value');

    expect(value).toBe(42);
  });

  // ---------------------
  // ❌ None case - throws error
  // ---------------------
  it('❌ throws error for None', () => {
    const option = None;

    expect(() => {
      expectMethod(option, 'Custom error message');
    }).toThrow('Custom error message');
  });

  // ---------------------
  // ❌ None case - throws default error
  // ---------------------
  it('❌ throws default error message for None', () => {
    const option = None;

    expect(() => {
      expectMethod(option, 'Expected a value');
    }).toThrow('Expected a value');
  });

  // ---------------------
  // ✅ Type safety check
  // ---------------------
  it('✅ preserves type safety', () => {
    const option = Some('hello'); // ✅ Option<string>
    const value = expectMethod(option, 'Expected string value');

    // ✅ TypeScript знает: value — string
    expect(typeof value).toBe('string');
    expect(value).toBe('hello');
  });

  // ---------------------
  // ✅ Works with complex types
  // ---------------------
  it('✅ works with complex types', () => {
    type User = { id: number; name: string };
    const option = Some({ id: 1, name: 'Alice' } satisfies User);
    const user = expectMethod(option, 'Expected user');

    // ✅ TypeScript знает: user — User
    expect(user.id).toBe(1);
    expect(user.name).toBe('Alice');
  });

  // ---------------------
  // ❌ Error message is customizable
  // ---------------------
  it('❌ allows custom error messages', () => {
    const option = None;

    expect(() => {
      expectMethod(option, 'User not found');
    }).toThrow('User not found');

    expect(() => {
      expectMethod(option, 'Database connection failed');
    }).toThrow('Database connection failed');
  });

  // ---------------------
  // ✅ Error thrown is instance of Error
  // ---------------------
  it('✅ throws Error instance', () => {
    const option = None;

    try {
      expectMethod(option, 'Test error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('Test error');
    }
  });

  // ---------------------
  // ✅ Multiple calls with same option
  // ---------------------
  it('✅ handles multiple calls safely', () => {
    const option = Some(100);

    const value1 = expectMethod(option, 'First call');
    const value2 = expectMethod(option, 'Second call');

    expect(value1).toBe(100);
    expect(value2).toBe(100);
  });

  // ---------------------
  // ❌ Multiple calls with None - all throw
  // ---------------------
  it('❌ multiple calls with None all throw', () => {
    const option = None;

    expect(() => {
      expectMethod(option, 'First error');
    }).toThrow('First error');

    expect(() => {
      expectMethod(option, 'Second error');
    }).toThrow('Second error');
  });
});


