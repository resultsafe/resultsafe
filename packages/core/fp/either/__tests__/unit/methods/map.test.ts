import { Left, map, Right, type Either } from '@resultsafe/core-fp-either';
import { describe, expect, it } from 'vitest';
/**
 * 🧪 Comprehensive Test Suite for Either.map function
 *
 * [EN] Complete test coverage for the map function with type safety checks,
 * edge cases, and real-world scenarios
 *
 * [RU] Полное покрытие тестами функции map с проверками типобезопасности,
 * крайними случаями и реальными сценариями использования
 */
describe('Either.map', () => {
  // ✅ Basic functionality tests / Базовые тесты функциональности
  describe('🎯 Basic Functionality / Базовая функциональность', () => {
    it('✨ should map Right value / должен преобразовать Right значение', () => {
      // [EN] Test mapping a successful value
      // [RU] Тест преобразования успешного значения
      const right: Either<string, number> = Right(42);
      const result = map(right, (x: number) => x * 2);

      expect(result).toEqual({ _tag: 'Right', right: 84 });
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right).toBe(84);
      }
    });

    it('🚫 should not map Left value / не должен преобразовать Left значение', () => {
      // [EN] Test that Left values pass through unchanged
      // [RU] Тест что Left значения проходят без изменений
      const left: Either<string, number> = Left('error');
      const result = map(left, (x: number) => x * 2);

      expect(result).toEqual({ _tag: 'Left', left: 'error' });
      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left).toBe('error');
      }
    });
  });

  // 🔄 Type transformation tests / Тесты преобразования типов
  describe('🔄 Type Transformations / Преобразования типов', () => {
    it('🔢 should transform number to string / должен преобразовать число в строку', () => {
      const either: Either<Error, number> = Right(123);
      const result = map(either, (n: number) => n.toString());

      expect(result).toEqual({ _tag: 'Right', right: '123' });
      // Type check: result should be Either<Error, string>
      const _typeCheck: Either<Error, string> = result;
    });

    it('📝 should transform string to object / должен преобразовать строку в объект', () => {
      const either: Either<string, string> = Right('hello');
      const result = map(either, (s: string) => ({
        message: s,
        length: s.length,
      }));

      expect(result).toEqual({
        _tag: 'Right',
        right: { message: 'hello', length: 5 },
      });
      // Type check: result should be Either<string, { message: string; length: number }>
      const _typeCheck: Either<string, { message: string; length: number }> =
        result;
    });

    it('🎭 should transform to different generic type / должен преобразовать в другой обобщенный тип', () => {
      const either: Either<string, string[]> = Right(['a', 'b', 'c']);
      const result = map(either, (arr: string[]) => arr.length);

      expect(result).toEqual({ _tag: 'Right', right: 3 });
      // Type check: result should be Either<string, number>
      const _typeCheck: Either<string, number> = result;
    });
  });

  // 🏗️ Complex transformation tests / Тесты сложных преобразований
  describe('🏗️ Complex Transformations / Сложные преобразования', () => {
    interface User {
      id: number;
      name: string;
      email: string;
    }

    interface UserProfile {
      displayName: string;
      isVerified: boolean;
      domain: string;
    }

    it('👤 should transform user data / должен преобразовать пользовательские данные', () => {
      const user: User = { id: 1, name: 'John Doe', email: 'john@example.com' };
      const either: Either<string, User> = Right(user);

      const result = map(
        either,
        (u: User): UserProfile => ({
          displayName: u.name.toUpperCase(),
          isVerified: u.email.includes('@'),
          domain: u.email.split('@')[1] || '',
        }),
      );

      expect(result).toEqual({
        _tag: 'Right',
        right: {
          displayName: 'JOHN DOE',
          isVerified: true,
          domain: 'example.com',
        },
      });
    });

    it('🧮 should handle mathematical transformations / должен обрабатывать математические преобразования', () => {
      const numbers: Either<string, number[]> = Right([1, 2, 3, 4, 5]);

      const result = map(numbers, (nums: number[]) => ({
        sum: nums.reduce((a, b) => a + b, 0),
        average: nums.reduce((a, b) => a + b, 0) / nums.length,
        max: Math.max(...nums),
        min: Math.min(...nums),
      }));

      expect(result).toEqual({
        _tag: 'Right',
        right: {
          sum: 15,
          average: 3,
          max: 5,
          min: 1,
        },
      });
    });
  });

  // 🎯 Edge cases / Крайние случаи
  describe('🎯 Edge Cases / Крайние случаи', () => {
    it('🔄 should preserve Left with different error types / должен сохранить Left с разными типами ошибок', () => {
      const errorEither: Either<Error, number> = Left(
        new Error('Network error'),
      );
      const result = map(errorEither, (x: number) => x.toString());

      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left.message).toBe('Network error');
      }
    });

    it('🗂️ should handle nested Either transformations / должен обрабатывать вложенные Either преобразования', () => {
      const nested: Either<string, Either<number, string>> = Right(
        Right('success'),
      );
      const result = map(nested, (inner: Either<number, string>) =>
        inner._tag === 'Right' ? inner.right.toUpperCase() : 'FAILED',
      );

      expect(result).toEqual({ _tag: 'Right', right: 'SUCCESS' });
    });

    it('🚀 should handle async-like transformations / должен обрабатывать async-подобные преобразования', () => {
      const either: Either<string, string> = Right('data');
      const result = map(either, (data: string) =>
        Promise.resolve(data.length),
      );

      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right).toBeInstanceOf(Promise);
        return result.right.then((length) => {
          expect(length).toBe(4);
        });
      }
    });
  });

  // 🎭 Real-world scenarios / Реальные сценарии
  describe('🎭 Real-world Scenarios / Реальные сценарии', () => {
    it('🌐 API response parsing / Парсинг ответа API', () => {
      // [EN] Simulate API response parsing
      // [RU] Имитация парсинга ответа API
      interface ApiResponse {
        status: number;
        data: unknown;
      }

      interface ParsedData {
        items: string[];
        count: number;
        hasMore: boolean;
      }

      const apiResponse: Either<string, ApiResponse> = Right({
        status: 200,
        data: { items: ['a', 'b', 'c'], count: 3 },
      });

      const result = map(apiResponse, (response: ApiResponse): ParsedData => {
        const data = response.data as { items: string[]; count: number };
        return {
          items: data.items,
          count: data.count,
          hasMore: data.count > 10,
        };
      });

      expect(result).toEqual({
        _tag: 'Right',
        right: {
          items: ['a', 'b', 'c'],
          count: 3,
          hasMore: false,
        },
      });
    });

    it('📊 Data validation and transformation / Валидация и преобразование данных', () => {
      // [EN] Real-world data validation scenario
      // [RU] Реальный сценарий валидации данных
      interface RawUser {
        firstName: string;
        lastName: string;
        age: string;
        email: string;
      }

      interface ValidatedUser {
        fullName: string;
        age: number;
        email: string;
        isAdult: boolean;
      }

      const rawData: Either<string, RawUser> = Right({
        firstName: 'Alice',
        lastName: 'Johnson',
        age: '25',
        email: 'alice.johnson@email.com',
      });

      const result = map(rawData, (raw: RawUser): ValidatedUser => {
        const age = parseInt(raw.age, 10);
        return {
          fullName: `${raw.firstName} ${raw.lastName}`,
          age,
          email: raw.email.toLowerCase(),
          isAdult: age >= 18,
        };
      });

      expect(result).toEqual({
        _tag: 'Right',
        right: {
          fullName: 'Alice Johnson',
          age: 25,
          email: 'alice.johnson@email.com',
          isAdult: true,
        },
      });
    });

    it('🔐 Configuration processing / Обработка конфигурации', () => {
      // [EN] Configuration file processing scenario
      // [RU] Сценарий обработки файла конфигурации
      interface RawConfig {
        port: string;
        host: string;
        debug: string;
        features: string;
      }

      interface ProcessedConfig {
        port: number;
        host: string;
        debug: boolean;
        features: string[];
      }

      const config: Either<Error, RawConfig> = Right({
        port: '3000',
        host: 'localhost',
        debug: 'true',
        features: 'auth,logging,metrics',
      });

      const result = map(
        config,
        (raw: RawConfig): ProcessedConfig => ({
          port: parseInt(raw.port, 10) || 8080,
          host: raw.host || 'localhost',
          debug: raw.debug.toLowerCase() === 'true',
          features: raw.features.split(',').map((f) => f.trim()),
        }),
      );

      expect(result).toEqual({
        _tag: 'Right',
        right: {
          port: 3000,
          host: 'localhost',
          debug: true,
          features: ['auth', 'logging', 'metrics'],
        },
      });
    });
  });

  // ⚡ Performance and edge cases / Производительность и крайние случаи
  describe('⚡ Performance & Edge Cases / Производительность и крайние случаи', () => {
    it('📏 should handle large data transformations / должен обрабатывать большие данные', () => {
      const largeArray: Either<string, number[]> = Right(
        Array.from({ length: 1000 }, (_, i) => i),
      );

      const result = map(largeArray, (arr: number[]) => ({
        length: arr.length,
        sum: arr.reduce((a, b) => a + b, 0),
        processed: true,
      }));

      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right.length).toBe(1000);
        expect(result.right.sum).toBe(499500); // Sum of 0 to 999
        expect(result.right.processed).toBe(true);
      }
    });

    it('🔄 should be chainable with multiple maps / должен поддерживать цепочку map', () => {
      const initial: Either<string, number> = Right(10);

      // Chain multiple transformations
      const result1 = map(initial, (x: number) => x * 2);
      const result2 = map(result1, (x: number) => x.toString());
      const result3 = map(result2, (s: string) => `Value: ${s}`);

      expect(result3).toEqual({ _tag: 'Right', right: 'Value: 20' });
    });

    it('🧪 should maintain type safety through complex chains / должен сохранять типобезопасность в сложных цепочках', () => {
      const start: Either<Error, string> = Right('hello');

      const step1 = map(start, (s: string) => s.length);
      // Type should be Either<Error, number>
      const _check1: Either<Error, number> = step1;

      const step2 = map(step1, (n: number) => n > 3);
      // Type should be Either<Error, boolean>
      const _check2: Either<Error, boolean> = step2;

      const step3 = map(step2, (b: boolean) => ({
        isLong: b,
        timestamp: Date.now(),
      }));
      // Type should be Either<Error, { isLong: boolean; timestamp: number }>
      const _check3: Either<Error, { isLong: boolean; timestamp: number }> =
        step3;

      expect(step3._tag).toBe('Right');
      if (step3._tag === 'Right') {
        expect(step3.right.isLong).toBe(true);
        expect(typeof step3.right.timestamp).toBe('number');
      }
    });
  });
});

// 🎯 Additional test helpers and utilities
// Дополнительные тестовые помощники и утилиты

/**
 * 🔧 Test helper to verify that Left values are preserved
 * Тестовый помощник для проверки сохранения Left значений
 */
function testLeftPreservation<L, R, U>(
  left: Either<L, R>,
  fn: (right: R) => U,
): void {
  const result = map(left, fn);
  expect(result._tag).toBe('Left');
  expect(result).toEqual(left);
}

/**
 * 🎪 Extended tests for specific edge cases
 * Расширенные тесты для специфических крайних случаев
 */
describe('🎪 Extended Edge Cases / Расширенные крайние случаи', () => {
  it('🔒 should preserve Left regardless of transformation complexity / должен сохранить Left независимо от сложности преобразования', () => {
    const left: Either<string, number> = Left('critical error');

    // Complex transformation that should never execute
    const complexTransform = (n: number) => {
      throw new Error('This should never execute');
    };

    testLeftPreservation(left, complexTransform);
  });

  it('🌟 should work with identity transformations / должен работать с identity преобразованиями', () => {
    const right: Either<string, number> = Right(42);
    const result = map(right, (x: number) => x);

    expect(result).toEqual({ _tag: 'Right', right: 42 });
  });

  it('🎨 should handle null and undefined transformations / должен обрабатывать null и undefined преобразования', () => {
    const rightWithNull: Either<string, string | null> = Right(null);
    const result1 = map(rightWithNull, (x: string | null) =>
      x === null ? 'was null' : x,
    );

    expect(result1).toEqual({ _tag: 'Right', right: 'was null' });

    const rightWithUndefined: Either<string, string | undefined> =
      Right(undefined);
    const result2 = map(
      rightWithUndefined,
      (x: string | undefined) => x ?? 'was undefined',
    );

    expect(result2).toEqual({ _tag: 'Right', right: 'was undefined' });
  });
});


