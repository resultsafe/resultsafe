// __tests__/methods/swap.alt.test.ts
import { Left, Right, swap, type Either } from '@resultsafe/core-fp-either';
import { describe, expect, it } from 'vitest';

describe('swap alternative 🌪️ / альтернативный тест swap', () => {
  // ---------------------
  // 🔹 Swap basic Left <-> Right / Базовое преобразование Left <-> Right
  // ---------------------
  it('🔹 swaps Left to Right correctly / правильно меняет Left на Right', () => {
    const left: Either<string, number> = Left('failure');

    const swapped = swap(left);

    expect(swapped._tag).toBe('Right');
    if (swapped._tag === 'Right') {
      const rightValue: string = swapped.right; // type-safe
      expect(rightValue).toBe('failure');
    }
  });

  it('🔹 swaps Right to Left correctly / правильно меняет Right на Left', () => {
    const right: Either<string, number> = Right(99);

    const swapped = swap(right);

    expect(swapped._tag).toBe('Left');
    if (swapped._tag === 'Left') {
      const leftValue: number = swapped.left; // type-safe
      expect(leftValue).toBe(99);
    }
  });

  // ---------------------
  // 🧩 Nested structures / Вложенные структуры
  // ---------------------
  it('🧩 swaps nested Eithers / работает с вложенными Either', () => {
    const nested: Either<string[], Either<number, string>> = Left([
      'error1',
      'error2',
    ]);

    const swapped = swap(nested);

    expect(swapped._tag).toBe('Right');
    if (swapped._tag === 'Right') {
      const rightValue: string[] = swapped.right;
      expect(rightValue).toEqual(['error1', 'error2']);
    }

    const nestedRight: Either<string[], Either<number, string>> = Right(
      Left(42),
    );
    const swappedRight = swap(nestedRight);

    expect(swappedRight._tag).toBe('Left');
    if (swappedRight._tag === 'Left') {
      const leftValue: Either<number, string> = swappedRight.left;
      expect(leftValue._tag).toBe('Left');
      if (leftValue._tag === 'Left') {
        expect(leftValue.left).toBe(42);
      }
    }
  });

  // ---------------------
  // 🌐 Real-world API scenario / Реальный кейс API
  // ---------------------
  it('🌐 swaps API error and success response / меняет местами ошибку и успешный ответ', () => {
    interface ApiError {
      status: number;
      message: string;
    }
    interface ApiResponse {
      data: string;
    }

    const apiRight: Either<ApiError, ApiResponse> = Right({ data: 'OK' });
    const swappedRight = swap(apiRight);

    expect(swappedRight._tag).toBe('Left');
    if (swappedRight._tag === 'Left') {
      const leftValue: ApiResponse = swappedRight.left;
      expect(leftValue.data).toBe('OK');
    }

    const apiLeft: Either<ApiError, ApiResponse> = Left({
      status: 404,
      message: 'Not Found',
    });
    const swappedLeft = swap(apiLeft);

    expect(swappedLeft._tag).toBe('Right');
    if (swappedLeft._tag === 'Right') {
      const rightValue: ApiError = swappedLeft.right;
      expect(rightValue.status).toBe(404);
      expect(rightValue.message).toBe('Not Found');
    }
  });

  // ---------------------
  // ⚡ Edge cases: null, undefined, falsy / Краевые случаи: null, undefined, falsыe
  // ---------------------
  it('⚡ handles null, undefined, and false values correctly / корректно обрабатывает null, undefined и false', () => {
    const leftNull: Either<null, number> = Left(null);
    const swappedNull = swap(leftNull);
    expect(swappedNull._tag).toBe('Right');
    if (swappedNull._tag === 'Right') expect(swappedNull.right).toBeNull();

    const rightUndefined: Either<string, undefined> = Right(undefined);
    const swappedUndefined = swap(rightUndefined);
    expect(swappedUndefined._tag).toBe('Left');
    if (swappedUndefined._tag === 'Left')
      expect(swappedUndefined.left).toBeUndefined();

    const rightFalse: Either<string, boolean> = Right(false);
    const swappedFalse = swap(rightFalse);
    expect(swappedFalse._tag).toBe('Left');
    if (swappedFalse._tag === 'Left') expect(swappedFalse.left).toBe(false);
  });

  // ---------------------
  // 🔄 Chaining swaps / Цепочка swap
  // ---------------------
  it('🔄 double swap returns original Either / двойной swap возвращает исходный Either', () => {
    const original: Either<string, number> = Left('error');
    const swappedOnce = swap(original);
    const swappedTwice = swap(swappedOnce);

    expect(swappedTwice).toEqual(original);
  });

  // ---------------------
  // 🧪 Type-safety verification / Проверка типобезопасности
  // ---------------------
  it('🧪 types remain correct after swap / типы остаются корректными после swap', () => {
    type L = { code: number };
    type R = { message: string };

    const either: Either<L, R> = Left({ code: 500 });
    const swapped: Either<R, L> = swap(either);

    if (swapped._tag === 'Right') {
      const val: L = swapped.right; // TypeScript проверка
      expect(val.code).toBe(500);
    }
  });
});


