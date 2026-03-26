// __tests__/methods/orElse.v2.test.ts
import {
  Left,
  Right,
  bimap,
  orElse,
  swap,
  type Either,
} from '@resultsafe/core-fp-either';
import { describe, expect, it } from 'vitest';

describe('orElse 🌟 / orElse тест', () => {
  // ---------------------
  // ✅ Basic Left handling / Базовое преобразование Left
  // ---------------------
  it('✅ [EN] applies function to Left value | [RU] применяет функцию к Left', () => {
    const left: Either<string, number> = Left('error');

    const result: Either<string, number> = orElse(left, (err) =>
      Right(err.length),
    );

    expect(result).toEqual({ _tag: 'Right', right: 5 });
  });

  // ---------------------
  // ✅ Right remains unchanged / Right остается без изменений
  // ---------------------
  it('✅ [EN] Right stays the same | [RU] Right не изменяется', () => {
    const right: Either<string, number> = Right(10);

    const result: Either<string, number> = orElse(right, (err) =>
      Right(err.length),
    );

    expect(result).toEqual({ _tag: 'Right', right: 10 });
  });

  // ---------------------
  // 🔄 Chaining with bimap / Цепочка с bimap
  // ---------------------
  it('🔄 [EN] chain orElse with bimap | [RU] цепочка orElse с bimap', () => {
    const leftNum: Either<number, string> = Left(4);

    const step1: Either<number, string> = orElse(leftNum, (n) =>
      Right((n * 2).toString()),
    );

    const step2: Either<number, string> = bimap(
      step1,
      (num) => num + 10,
      (str) => str.toUpperCase(),
    );

    expect(step2).toEqual({ _tag: 'Right', right: '8' }); // Left 4 → Right 4*2 → '8'.toUpperCase() = '8'
  });

  // ---------------------
  // 🔁 Chaining with swap / Цепочка с swap
  // ---------------------
  it('🔁 [EN] swap after orElse | [RU] swap после orElse', () => {
    const leftStr: Either<string, number> = Left('fail');

    const result = swap(orElse(leftStr, (e) => Right(e.length)));

    // swap меняет Left ↔ Right
    expect(result).toEqual({ _tag: 'Left', left: 4 });
  });

  // ---------------------
  // 🧩 Type-safe generic usage / Типобезопасное использование дженериков
  // ---------------------
  it('🧩 [EN] generic orElse with different types | [RU] дженериковый orElse с разными типами', () => {
    const leftBool: Either<boolean, number> = Left(true);

    const result: Either<string, number> = orElse(leftBool, (flag) =>
      Right(flag ? 1 : 0),
    );

    expect(result).toEqual({ _tag: 'Right', right: 1 });
  });

  // ---------------------
  // 🧪 Complex real-world scenario / Реальный кейс: API error recovery
  // ---------------------
  it('🧪 [EN] recover from API error | [RU] обработка ошибки API', () => {
    interface ApiError {
      code: number;
      message: string;
    }

    interface UserData {
      id: string;
      name: string;
    }

    const response: Either<ApiError, UserData> = Left({
      code: 500,
      message: 'Server error',
    });

    const recovered: Either<string, UserData> = orElse(response, (err) =>
      Right({ id: '0', name: 'Default' }),
    );

    expect(recovered._tag).toBe('Right');
    if (recovered._tag === 'Right') {
      expect(recovered.right.id).toBe('0');
      expect(recovered.right.name).toBe('Default');
    }
  });

  // ---------------------
  // ⚡ Edge case: Left with undefined / Краевой случай: Left с undefined
  // ---------------------
  it('⚡ [EN] handles undefined Left | [RU] обрабатывает Left с undefined', () => {
    const leftUndef: Either<undefined, number> = Left(undefined);

    const result: Either<string, number> = orElse(leftUndef, (v) =>
      Right(v === undefined ? 0 : v),
    );

    expect(result).toEqual({ _tag: 'Right', right: 0 });
  });

  // ---------------------
  // 🧮 Edge case: Left with null / Краевой случай: Left с null
  // ---------------------
  it('🧮 [EN] handles null Left | [RU] обрабатывает Left с null', () => {
    const leftNull: Either<null, number> = Left(null);

    const result: Either<string, number> = orElse(leftNull, (v) =>
      Right(v === null ? 0 : v),
    );

    expect(result).toEqual({ _tag: 'Right', right: 0 });
  });
});


