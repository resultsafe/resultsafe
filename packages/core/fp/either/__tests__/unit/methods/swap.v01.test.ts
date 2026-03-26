// __tests__/methods/swap.test.ts
import { Left, Right, swap, type Either } from '@resultsafe/core-fp-either';
import { describe, expect, it } from 'vitest';

describe('swap 🌪️ / swap тест', () => {
  // ---------------------
  // ✅ Basic functionality / Базовая функциональность
  // ---------------------
  it('🔄 should swap Left to Right / должен преобразовать Left в Right', () => {
    const value: Either<string, number> = Left('error');

    const swapped = swap(value);

    expect(swapped._tag).toBe('Right');
    if (swapped._tag === 'Right') {
      expect(swapped.right).toBe('error');
    }

    // Type check / Проверка типов
    const _typeCheck: Either<number, string> = swapped;
  });

  it('🔄 should swap Right to Left / должен преобразовать Right в Left', () => {
    const value: Either<string, number> = Right(42);

    const swapped = swap(value);

    expect(swapped._tag).toBe('Left');
    if (swapped._tag === 'Left') {
      expect(swapped.left).toBe(42);
    }

    // Type check / Проверка типов
    const _typeCheck: Either<number, string> = swapped;
  });

  // ---------------------
  // 🧪 Complex value types / Сложные типы значений
  // ---------------------
  it('🧩 should work with object values / работает с объектами', () => {
    const either: Either<{ code: number }, { data: string }> = Left({
      code: 500,
    });

    const swapped = swap(either);

    expect(swapped._tag).toBe('Right');
    if (swapped._tag === 'Right') {
      expect(swapped.right.code).toBe(500);
    }

    const eitherRight: Either<{ code: number }, { data: string }> = Right({
      data: 'ok',
    });

    const swappedRight = swap(eitherRight);

    expect(swappedRight._tag).toBe('Left');
    if (swappedRight._tag === 'Left') {
      expect(swappedRight.left.data).toBe('ok');
    }
  });

  it('📦 should work with arrays / работает с массивами', () => {
    const either: Either<string[], number[]> = Left(['error1', 'error2']);
    const swapped = swap(either);

    expect(swapped._tag).toBe('Right');
    if (swapped._tag === 'Right') {
      expect(swapped.right).toEqual(['error1', 'error2']);
    }

    const eitherRight: Either<string[], number[]> = Right([1, 2, 3]);
    const swappedRight = swap(eitherRight);

    expect(swappedRight._tag).toBe('Left');
    if (swappedRight._tag === 'Left') {
      expect(swappedRight.left).toEqual([1, 2, 3]);
    }
  });

  // ---------------------
  // 🌐 Real-world scenario / Реальный кейс
  // ---------------------
  it('🌐 swap API error and response / поменять местами ошибку и успешный ответ', () => {
    type ApiError = { status: number; message: string };
    type ApiResponse = { userId: string };

    const response: Either<ApiError, ApiResponse> = Right({ userId: 'abc123' });
    const swapped = swap(response);

    expect(swapped._tag).toBe('Left');
    if (swapped._tag === 'Left') {
      expect(swapped.left.userId).toBe('abc123');
    }

    const error: Either<ApiError, ApiResponse> = Left({
      status: 500,
      message: 'Server error',
    });
    const swappedError = swap(error);

    expect(swappedError._tag).toBe('Right');
    if (swappedError._tag === 'Right') {
      expect(swappedError.right.status).toBe(500);
      expect(swappedError.right.message).toBe('Server error');
    }
  });

  // ---------------------
  // ⚡ Edge cases / Крайние случаи
  // ---------------------
  it('⚡ should handle null and undefined values / корректно обрабатывает null и undefined', () => {
    const nullLeft: Either<null, number> = Left(null);
    const swappedNull = swap(nullLeft);
    expect(swappedNull._tag).toBe('Right');
    if (swappedNull._tag === 'Right') {
      expect(swappedNull.right).toBeNull();
    }

    const undefinedRight: Either<string, undefined> = Right(undefined);
    const swappedUndefined = swap(undefinedRight);
    expect(swappedUndefined._tag).toBe('Left');
    if (swappedUndefined._tag === 'Left') {
      expect(swappedUndefined.left).toBeUndefined();
    }
  });

  // ---------------------
  // 🔄 Chaining / Цепочка
  // ---------------------
  it('🔄 should allow chaining swaps / поддерживает цепочку swap', () => {
    const value: Either<string, number> = Left('error');
    const swappedOnce = swap(value);
    const swappedTwice = swap(swappedOnce);

    expect(swappedTwice).toEqual(value); // swap twice returns original
  });
});


