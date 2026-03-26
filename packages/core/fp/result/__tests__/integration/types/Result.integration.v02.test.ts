// Result.integration.v02.test.ts
import type { Result } from '@resultsafe/core-fp-result-shared';
import { describe, expect, it } from 'vitest';

/**
 * [EN] Function that may succeed or fail
 * [RU] Функция, которая может завершиться успешно или с ошибкой
 */
const divide = (a: number, b: number): Result<number, string> => {
  if (b === 0) {
    return { ok: false, error: 'Division by zero' };
  }
  return { ok: true, value: a / b };
};

/**
 * [EN] Function that always doubles a number
 * [RU] Функция, которая всегда удваивает число
 */
const double = (n: number): Result<number, string> => ({
  ok: true,
  value: n * 2,
});

describe('Result integration tests / Интеграционные тесты Result', () => {
  it('✅ Ok works correctly / Ok работает корректно', () => {
    // [EN] Call double with 5
    // [RU] Вызываем double с 5
    const result = double(5);

    // [EN] Type guard for Ok
    // [RU] Type guard для Ok
    if (result.ok) {
      // [EN] Check the value
      // [RU] Проверяем значение
      expect(result.value).toBe(10);
    } else {
      // [EN] Should not happen
      // [RU] Не должно выполняться
      throw new Error('Unexpected Err variant');
    }
  });

  it('❌ Err works correctly / Err работает корректно', () => {
    // [EN] Call divide with zero denominator
    // [RU] Вызываем divide с нулевым делителем
    const result = divide(10, 0);

    if (!result.ok) {
      // [EN] Check error message
      // [RU] Проверяем сообщение об ошибке
      expect(result.error).toBe('Division by zero');
    } else {
      throw new Error('Unexpected Ok variant');
    }
  });

  it('✅ Chain Ok operations / Цепочка операций Ok', () => {
    // [EN] First doubling
    // [RU] Первое удвоение
    const result1 = double(3);

    if (result1.ok) {
      // [EN] Second doubling
      // [RU] Второе удвоение
      const result2 = double(result1.value);
      if (result2.ok) {
        expect(result2.value).toBe(12);
      } else {
        throw new Error('Unexpected Err variant in chain');
      }
    } else {
      throw new Error('Unexpected Err variant in chain');
    }
  });

  it('✅ Chain mixed Ok and Err / Цепочка смешанных Ok и Err', () => {
    // [EN] Ok first, then Err
    // [RU] Сначала Ok, затем Err
    const result1 = divide(10, 2);

    if (result1.ok) {
      const result2 = divide(result1.value, 0);
      if (!result2.ok) {
        expect(result2.error).toBe('Division by zero');
      } else {
        throw new Error('Unexpected Ok variant in chain');
      }
    } else {
      throw new Error('Unexpected Err variant in chain');
    }
  });

  it('✅ Safe fallback on Err / Безопасный fallback при Err', () => {
    const result = divide(5, 0);

    // [EN] Provide default value when error occurs
    // [RU] Используем значение по умолчанию при ошибке
    const safeValue = result.ok ? result.value * 2 : 0;

    expect(safeValue).toBe(0);
  });

  it('✅ Complex chain with fallback / Сложная цепочка с fallback', () => {
    const result1 = divide(8, 2);
    // [EN] Next operation may fail
    // [RU] Следующая операция может вернуть ошибку
    const result2 = result1.ok ? divide(result1.value, 0) : result1;

    let finalValue: number;
    if (result2.ok) {
      finalValue = result2.value * 3;
    } else {
      // [EN] Fallback for Err
      // [RU] Значение по умолчанию при Err
      finalValue = 0;
    }

    expect(finalValue).toBe(0);
  });

  it('✅ Transformation of Ok to another Ok / Преобразование Ok в другой Ok', () => {
    const result = double(7);

    if (result.ok) {
      // [EN] Transform number to string
      // [RU] Преобразуем число в строку
      const transformed: Result<string, string> = {
        ok: true,
        value: `Value: ${result.value}`,
      };
      if (transformed.ok) {
        expect(transformed.value).toBe('Value: 14');
      } else {
        throw new Error('Unexpected Err variant in transformation');
      }
    } else {
      throw new Error('Unexpected Err variant in transformation');
    }
  });
});
