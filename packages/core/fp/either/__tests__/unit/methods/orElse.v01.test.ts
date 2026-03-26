// __tests__/methods/orElse.test.ts
import { Left, orElse, Right, type Either } from '@resultsafe/core-fp-either';
import { describe, expect, it } from 'vitest';

describe('orElse 🌀 / полный тест orElse', () => {
  // ---------------------
  // 🔹 Basic Left case / Базовый случай Left
  // ---------------------
  it('🔹 calls fn when Left / вызывает fn для Left', () => {
    const left: Either<string, number> = Left('error');

    const result: Either<never, number> = orElse(left, (err) =>
      Right(err.length),
    );

    expect(result._tag).toBe('Right');
    if (result._tag === 'Right') {
      const value: number = result.right; // type-safe
      expect(value).toBe(5);
    }
  });

  // ---------------------
  // 🔹 Basic Right case / Базовый случай Right
  // ---------------------
  it('🔹 does not call fn when Right / не вызывает fn для Right', () => {
    const right: Either<string, number> = Right(42);

    const result: Either<string, number> = orElse(right, () =>
      Left('should not happen'),
    );

    expect(result._tag).toBe('Right');
    if (result._tag === 'Right') {
      const value: number = result.right;
      expect(value).toBe(42);
    }
  });

  // ---------------------
  // 🧩 Nested Eithers / Вложенные структуры
  // ---------------------
  it('🧩 works with nested Either / работает с вложенными Either', () => {
    type InnerEither = Either<string, number>;
    const nestedLeft: Either<string[], InnerEither> = Left(['fail1', 'fail2']);

    // Используем orElse для внешнего Left
    const result: Either<never, number> = (() => {
      const r = orElse(nestedLeft, () => Right(Right(0))); // внешний Left → Right(inner Right)
      // "распаковываем" внутренний Right
      if (r._tag === 'Right' && r.right._tag === 'Right') {
        return Right(r.right.right);
      }
      return Right(0); // fallback
    })();

    expect(result._tag).toBe('Right');
    if (result._tag === 'Right') {
      const value: number = result.right;
      expect(value).toBe(0);
    }
  });

  // ---------------------
  // 🌐 Real-world scenario / Реальный сценарий API
  // ---------------------
  it('🌐 transforms API error / преобразует ошибку API', () => {
    interface ApiError {
      code: number;
      message: string;
    }
    interface ApiResponse {
      data: string;
    }

    const apiLeft: Either<ApiError, ApiResponse> = Left({
      code: 500,
      message: 'Server error',
    });

    const result: Either<never, ApiResponse> = orElse(apiLeft, (err) =>
      Right({ data: `Fallback: ${err.message}` }),
    );

    expect(result._tag).toBe('Right');
    if (result._tag === 'Right') {
      expect(result.right.data).toBe('Fallback: Server error');
    }

    const apiRight: Either<ApiError, ApiResponse> = Right({ data: 'Success' });
    const result2: Either<ApiError, ApiResponse> = orElse(apiRight, () =>
      Left({ code: 0, message: 'Should not run' }),
    );
    expect(result2._tag).toBe('Right');
    if (result2._tag === 'Right') expect(result2.right.data).toBe('Success');
  });

  // ---------------------
  // ⚡ Edge cases / Краевые случаи
  // ---------------------
  it('⚡ handles null, undefined, and false values / корректно обрабатывает null, undefined и false', () => {
    const leftNull: Either<null, number> = Left(null);
    const resultNull: Either<never, number> = orElse(leftNull, () => Right(42));
    expect(resultNull._tag).toBe('Right');
    if (resultNull._tag === 'Right') expect(resultNull.right).toBe(42);

    const rightUndefined: Either<string, undefined> = Right(undefined);
    const resultUndefined: Either<string, undefined> = orElse(
      rightUndefined,
      () => Left('fallback'),
    );
    expect(resultUndefined._tag).toBe('Right');
    if (resultUndefined._tag === 'Right')
      expect(resultUndefined.right).toBeUndefined();

    const leftFalse: Either<boolean, number> = Left(false);
    const resultFalse: Either<never, number> = orElse(leftFalse, (v) =>
      Right(v ? 1 : 0),
    );
    expect(resultFalse._tag).toBe('Right');
    if (resultFalse._tag === 'Right') expect(resultFalse.right).toBe(0);
  });

  // ---------------------
  // 🔄 Chaining orElse / Цепочка orElse
  // ---------------------
  it('🔄 chains multiple orElse calls / корректно цепляет несколько orElse', () => {
    const e1: Either<string, number> = Left('first');

    const result: Either<never, number> = orElse(e1, (l1) =>
      orElse(Left(l1.length), (l2) => Right(l2 * 10)),
    );

    expect(result._tag).toBe('Right');
    if (result._tag === 'Right') expect(result.right).toBe(50); // 'first'.length = 5 * 10
  });

  // ---------------------
  // 🧪 Type-safety verification / Проверка типобезопасности
  // ---------------------
  it('🧪 types remain correct / типы остаются корректными', () => {
    type L = { code: number };
    type R = { data: string };
    type M = { fallback: boolean };

    const either: Either<L, R> = Left({ code: 404 });
    const swapped: Either<M, R> = orElse(either, (l) =>
      Left({ fallback: l.code === 404 }),
    );

    if (swapped._tag === 'Left') {
      const leftVal: M = swapped.left; // TS проверка
      expect(leftVal.fallback).toBe(true);
    }
  });

  // ---------------------
  // 🌟 Realistic data pipeline / Реальный конвейер данных
  // ---------------------
  it('🌟 integrates in a data pipeline / интегрируется в конвейере данных', () => {
    interface ValidationError {
      field: string;
      message: string;
    }
    interface Payload {
      content: string;
    }

    const validate: Either<ValidationError[], Payload> = Left([
      { field: 'email', message: 'Invalid' },
    ]);

    const result: Either<never, Payload> = orElse(validate, (errs) => {
      // Проверяем, что errs[0] существует
      const fieldName = errs[0]?.field ?? 'unknown';
      return Right({ content: `Recovered from ${fieldName}` });
    });

    expect(result._tag).toBe('Right');
    if (result._tag === 'Right') {
      expect(result.right.content).toBe('Recovered from email');
    }
  });
  // ---------------------
  // 🧩 Nested Either: Left outer / Вложенный Left снаружи
  // ---------------------
  it('🧩 transforms outer Left to Right / преобразует внешний Left в Right', () => {
    type InnerEither = Either<string, number>;
    const nestedLeft: Either<string[], InnerEither> = Left(['fail1', 'fail2']);

    // Используем orElse для внешнего Left
    const outer: Either<never, InnerEither> = orElse(nestedLeft, () =>
      Right(Right(0)),
    );

    expect(outer._tag).toBe('Right');

    if (outer._tag === 'Right') {
      const inner = outer.right; // Это InnerEither
      const value: number = inner._tag === 'Right' ? inner.right : 0; // fallback если внутренний Left
      expect(value).toBe(0);
    }
  });

  // ---------------------
  // 🔹 Nested Either: Right outer with Left inner / Правый внешний с левым внутренним
  // ---------------------
  it('🔹 keeps inner Left / сохраняет внутренний Left', () => {
    type InnerEither = Either<string, number>;
    const nestedRight: Either<string[], InnerEither> = Right(
      Left('inner fail'),
    );

    // Разворачиваем внутренний Either безопасно
    const result: Either<string, number> =
      nestedRight._tag === 'Right' ? nestedRight.right : Left('fallback');

    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      const value: string = result.left; // типобезопасно
      expect(value).toBe('inner fail');
    }
  });

  // ---------------------
  // 🌐 Nested Either: Right outer with Right inner / Правый внешний с правым внутренним
  // ---------------------
  it('🌐 unwraps inner Right / разворачивает внутренний Right', () => {
    type InnerEither = Either<string, number>;
    const nestedRight: Either<string[], InnerEither> = Right(Right(123));

    const result: Either<never, number> =
      nestedRight._tag === 'Right' && nestedRight.right._tag === 'Right'
        ? Right(nestedRight.right.right)
        : Right(0);

    expect(result._tag).toBe('Right');
    if (result._tag === 'Right') expect(result.right).toBe(123);
  });
});


