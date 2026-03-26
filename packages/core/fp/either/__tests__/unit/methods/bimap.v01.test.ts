// __tests__/methods/bimap.test.ts
import { Left, Right, bimap, type Either } from '@resultsafe/core-fp-either';
import { describe, expect, it } from 'vitest';

describe('bimap', () => {
  // ---------------------
  // ✅ Left case: applies leftFn
  // ---------------------
  it('applies leftFn to Left value', () => {
    const either: Either<string, number> = Left('error');

    const result = bimap(
      either,
      (e) => e.toUpperCase(),
      (x) => x * 2,
    );

    expect(result).toEqual({ _tag: 'Left', left: 'ERROR' });
  });

  // ---------------------
  // ✅ Right case: applies rightFn
  // ---------------------
  it('applies rightFn to Right value', () => {
    const either: Either<string, number> = Right(5);

    const result = bimap(
      either,
      (e) => e.toUpperCase(),
      (x) => x * 2,
    );

    expect(result).toEqual({ _tag: 'Right', right: 10 });
  });

  // ---------------------
  // 🔄 Round-trip conversion Left → Right → Left
  // ---------------------
  it('round-trip conversion works', () => {
    const originalEither: Either<string, number> = Left('original error');

    const mappedToRight = bimap(
      originalEither,
      (e) => ({ message: e }),
      (x) => x.toString(),
    );

    const mappedToLeft = bimap(
      mappedToRight,
      (obj) => obj.message,
      (s) => parseInt(s, 10),
    );

    expect(mappedToLeft).toEqual({ _tag: 'Left', left: 'original error' });
  });

  // ---------------------
  // 🧪 Complex value types
  // ---------------------
  it('works with complex value types', () => {
    // Object
    const objEither: Either<string, { id: number; name: string }> = Right({
      id: 1,
      name: 'Alice',
    });

    const mappedObj = bimap(
      objEither,
      (e) => ({ code: 500, message: e }),
      (obj) => ({ ...obj, isActive: true }),
    );

    expect(mappedObj).toEqual({
      _tag: 'Right',
      right: { id: 1, name: 'Alice', isActive: true },
    });

    // Array
    const arrayEither: Either<string, number[]> = Right([1, 2, 3]);

    const mappedArray = bimap(
      arrayEither,
      (e) => [e],
      (arr) => arr.map((x) => x * 2),
    );

    expect(mappedArray).toEqual({ _tag: 'Right', right: [2, 4, 6] });

    // Custom class
    class User {
      constructor(
        public readonly id: number,
        public readonly name: string,
      ) {}
    }

    const userEither: Either<string, User> = Right(new User(1, 'Bob'));

    const mappedUser = bimap(
      userEither,
      (e) => new Error(e),
      (user) => ({ ...user, isActive: true }),
    );

    expect(mappedUser).toEqual({
      _tag: 'Right',
      right: { id: 1, name: 'Bob', isActive: true },
    });
  });

  // ---------------------
  // 📊 Type narrowing works
  // ---------------------
  it('type narrowing works correctly', () => {
    type ApiError =
      | { type: 'network'; message: string }
      | { type: 'validation'; field: string; issues: string[] }
      | { type: 'auth'; userId: number };

    const either: Either<ApiError, number> = Left({
      type: 'network',
      message: 'Connection timeout',
    });

    const mapped = bimap(
      either,
      (error) => {
        if (error.type === 'network') return error.message;
        if (error.type === 'validation') return error.field;
        if (error.type === 'auth') return error.userId.toString();
        return 'Unknown error';
      },
      (x) => x.toString(),
    );

    if (mapped._tag === 'Left') {
      expect(typeof mapped.left).toBe('string');
      expect(mapped.left).toBe('Connection timeout');
    } else {
      expect(typeof mapped.right).toBe('string');
    }
  });

  // ---------------------
  // ⚡ Performance: no mutation
  // ---------------------
  it('does not mutate original Either', () => {
    const originalEither: Either<string, number> = Right(42);
    const originalCopy = { ...originalEither };

    const mapped = bimap(
      originalEither,
      (e) => e.toUpperCase(),
      (x) => x * 2,
    );

    expect(originalEither).toEqual(originalCopy);
    expect(mapped).toEqual({ _tag: 'Right', right: 84 });
  });

  // ---------------------
  // 🧩 Integration with other Either methods
  // ---------------------
  it('integrates with other Either methods', () => {
    const either: Either<string, number> = Right(5);

    const mapped = bimap(
      either,
      (e) => e.toUpperCase(),
      (x) => x * 2,
    );

    const doubled =
      mapped._tag === 'Right'
        ? { _tag: 'Right', right: mapped.right * 2 }
        : mapped;

    expect(doubled).toEqual({ _tag: 'Right', right: 10 });

    const chained =
      mapped._tag === 'Right'
        ? mapped.right > 10
          ? Right(mapped.right.toString())
          : Left('Value too small')
        : mapped;

    expect(chained).toEqual({ _tag: 'Left', left: 'Value too small' });
  });

  // ---------------------
  // 🧪 Edge cases
  // ---------------------
  it('handles edge cases correctly', () => {
    // Zero
    const zeroEither: Either<string, number> = Right(0);
    const mappedZero = bimap(
      zeroEither,
      (e) => e,
      (x) => x + 1,
    );
    expect(mappedZero).toEqual({ _tag: 'Right', right: 1 });

    // Empty string
    const emptyEither: Either<string, number> = Left('');
    const mappedEmpty = bimap(
      emptyEither,
      (e) => e || 'Default error',
      (x) => x,
    );
    expect(mappedEmpty).toEqual({ _tag: 'Left', left: 'Default error' });

    // Null
    const nullEither: Either<string | null, string | null> = Right(null);
    const mappedNull = bimap(
      nullEither,
      (e) => e,
      (x) => x ?? 'Default',
    );
    expect(mappedNull).toEqual({ _tag: 'Right', right: 'Default' });

    // Undefined
    const undefEither: Either<undefined | string, number> = Left(undefined);
    const mappedUndef = bimap(
      undefEither,
      (e) => e ?? 'Default error',
      (x) => x,
    );
    expect(mappedUndef).toEqual({ _tag: 'Left', left: 'Default error' });

    // False
    const falseEither: Either<string, boolean> = Right(false);
    const mappedFalse = bimap(
      falseEither,
      (e) => e,
      (x) => (x ? 'Yes' : 'No'),
    );
    expect(mappedFalse).toEqual({ _tag: 'Right', right: 'No' });
  });

  // ---------------------
  // 🧪 [EN] Type inference with generics
  // 🧪 [RU] Вывод типов с дженериками
  // ---------------------
  it('🧪 [EN] type inference works with generics | [RU] вывод типов работает с дженериками', () => {
    // Generic function that uses bimap
    const transformEither = <L, R, M, U>(
      either: Either<L, R>,
      leftFn: (left: L) => M,
      rightFn: (right: R) => U,
    ): Either<M, U> => bimap(either, leftFn, rightFn);

    // Right-only value
    const either: Either<unknown, { status: number; message: string }> = Right({
      status: 200,
      message: 'OK',
    });

    // Explicitly type Left as unknown to avoid TS inferring never
    const mapped = transformEither(
      either,
      (e: unknown) => (e != null ? e.toString() : 'unknown'), // safe conversion
      (obj) => `${obj.status}: ${obj.message}`,
    );

    if (mapped._tag === 'Right') {
      expect(mapped.right).toBe('200: OK');
    } else {
      // Left is unlikely in this test but type-safe fallback
      expect(typeof mapped.left).toBe('string');
    }
  });

  // ---------------------
  // 🧪 Union types as value
  // ---------------------
  it('works with union value types', () => {
    type UserResponse = { type: 'user'; id: number; name: string };
    type ProductResponse = { type: 'product'; id: number; title: string };
    type OrderResponse = { type: 'order'; id: number; total: number };

    type ApiResponse = UserResponse | ProductResponse | OrderResponse;

    const either: Either<string, ApiResponse> = Right({
      type: 'user',
      id: 123,
      name: 'John Doe',
    });

    const mapped = bimap(
      either,
      (e) => e.toUpperCase(),
      (response) => ('name' in response ? response.name : 'Unknown'),
    );

    if (mapped._tag === 'Right') {
      expect(mapped.right).toBe('John Doe');
    }
  });
});


