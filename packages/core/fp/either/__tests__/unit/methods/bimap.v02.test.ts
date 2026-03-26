import { bimap, Left, Right, type Either } from '@resultsafe/core-fp-either';
import { describe, expect, it } from 'vitest';

/**
 * 🧪 Comprehensive Test Suite for Either.bimap function
 *
 * [EN] Complete test coverage for the bimap function with type safety checks,
 * edge cases, and real-world scenarios. Bimap transforms both Left and Right values.
 *
 * [RU] Полное покрытие тестами функции bimap с проверками типобезопасности,
 * крайними случаями и реальными сценариями. Bimap преобразует как Left, так и Right значения.
 */

describe('Either.bimap', () => {
  // ✅ Basic functionality tests / Базовые тесты функциональности
  describe('🎯 Basic Functionality / Базовая функциональность', () => {
    it('✨ should map Right value with rightFn / должен преобразовать Right значение с rightFn', () => {
      const right: Either<string, number> = Right(42);
      const result = bimap(
        right,
        (error: string) => error.toUpperCase(),
        (value: number) => value * 2,
      );

      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right).toBe(84);
      }
    });

    it('🚫 should map Left value with leftFn / должен преобразовать Left значение с leftFn', () => {
      const left: Either<string, number> = Left('error');
      const result = bimap(
        left,
        (error: string) => error.toUpperCase(),
        (value: number) => value * 2,
      );

      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left).toBe('ERROR');
      }
    });
  });

  // 🔄 Type transformation tests / Тесты преобразования типов
  describe('🔄 Type Transformations / Преобразования типов', () => {
    it('🔢 should transform both sides: string→Error, number→string / должен преобразовать обе стороны: string→Error, number→string', () => {
      const rightCase: Either<string, number> = Right(123);
      const result1 = bimap(
        rightCase,
        (error: string) => new Error(error),
        (value: number) => value.toString(),
      );

      expect(result1._tag).toBe('Right');
      if (result1._tag === 'Right') {
        expect(result1.right).toBe('123');
      }

      const leftCase: Either<string, number> = Left('network failure');
      const result2 = bimap(
        leftCase,
        (error: string) => new Error(error),
        (value: number) => value.toString(),
      );

      expect(result2._tag).toBe('Left');
      if (result2._tag === 'Left') {
        expect(result2.left).toBeInstanceOf(Error);
        expect(result2.left.message).toBe('network failure');
      }
    });

    it('📝 should transform to complex objects / должен преобразовать в сложные объекты', () => {
      interface ErrorDetails {
        code: number;
        message: string;
        timestamp: number;
      }

      interface SuccessPayload {
        data: string;
        processed: boolean;
        metadata: Record<string, unknown>;
      }

      const either: Either<string, { value: number }> = Right({ value: 42 });
      const result = bimap(
        either,
        (error: string): ErrorDetails => ({
          code: 500,
          message: error,
          timestamp: Date.now(),
        }),
        (data: { value: number }): SuccessPayload => ({
          data: JSON.stringify(data),
          processed: true,
          metadata: { originalValue: data.value },
        }),
      );

      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right.data).toBe('{"value":42}');
        expect(result.right.processed).toBe(true);
        expect(result.right.metadata['originalValue']).toBe(42); // ✅ безопасный доступ
      }
    });

    it('🎭 should handle generic transformations / должен обрабатывать обобщенные преобразования', () => {
      const either: Either<number[], string[]> = Left([1, 2, 3]);
      const result = bimap(
        either,
        (errors: number[]) => errors.map((e) => `Error ${e}`),
        (items: string[]) => items.length,
      );

      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left).toEqual(['Error 1', 'Error 2', 'Error 3']);
      }
    });
  });

  // 🎭 Real-world scenario with detailed error / реальный кейс с детализированными ошибками
  describe('🎭 Real-world scenario with validation / Реальный кейс с валидацией', () => {
    interface ValidationError {
      field: string;
      message: string;
      code: string;
    }

    interface DetailedError {
      type: 'validation';
      errors: ValidationError[];
      timestamp: Date;
    }

    interface User {
      name: string;
      email: string;
      age: number;
    }

    it('👤 should transform validation errors correctly / правильно преобразует ошибки валидации', () => {
      const invalidUser: Either<ValidationError[], User> = Left([
        {
          field: 'email',
          message: 'Invalid email format',
          code: 'INVALID_EMAIL',
        },
        { field: 'age', message: 'Age must be positive', code: 'INVALID_AGE' },
      ]);

      const result = bimap(
        invalidUser,
        (errors: ValidationError[]): DetailedError => ({
          type: 'validation',
          errors,
          timestamp: new Date('2023-01-01'),
        }),
        (user: User) => user,
      );

      expect(result._tag).toBe('Left');
      if (result._tag === 'Left' && result.left) {
        const left = result.left as DetailedError;
        expect(left.type).toBe('validation');
        expect(left.errors).toHaveLength(2);

        const firstError = left.errors[0] as ValidationError;
        const secondError = left.errors[1] as ValidationError;

        expect(firstError.field).toBe('email');
        expect(secondError.field).toBe('age');
        expect(left.timestamp).toBeInstanceOf(Date);
      }
    });
  });
});


