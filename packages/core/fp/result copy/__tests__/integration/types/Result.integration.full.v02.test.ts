// Result.integration.full.v02.test.ts
import type { Result } from '@resultsafe/core-fp-result-shared';
import { describe, expect, it } from 'vitest';

/**
 * [EN] Function that may succeed or fail depending on the divisor
 * [RU] Функция, которая может завершиться успешно или с ошибкой в зависимости от делителя
 */
const divide = (a: number, b: number): Result<number, string> =>
  b === 0
    ? { ok: false, error: 'Division by zero' }
    : { ok: true, value: a / b };

/**
 * [EN] Function that always doubles a number and returns Ok
 * [RU] Функция, которая всегда удваивает число и возвращает Ok
 */
const double = (n: number): Result<number, string> => ({
  ok: true,
  value: n * 2,
});

/**
 * [EN] Function that always returns Err
 * [RU] Функция, которая всегда возвращает Err
 */
const fail = (msg: string): Result<number, string> => ({
  ok: false,
  error: msg,
});

/**
 * [EN] Helper type for compile-time type-safety checks
 * [RU] Вспомогательный тип для проверки типобезопасности на этапе компиляции
 * Naming with _ prefix to satisfy ESLint for unused vars
 */
type _ExpectError<T extends never> = T;

describe('Result full integration + type-safety tests / Полные интеграционные и типобезопасные тесты', () => {
  // ---------------------
  // Basic Ok / Err checks
  // ---------------------
  it('✅ Ok contains value / Ok содержит value', () => {
    const r = double(5);
    // [EN] Result should be Ok
    // [RU] Результат должен быть Ok
    expect(r.ok).toBe(true);
    if (r.ok) {
      // [EN] Value should match expected
      // [RU] Значение должно совпадать с ожидаемым
      expect(r.value).toBe(10);
    }
  });

  it('❌ Err contains error / Err содержит error', () => {
    const r = fail('Failed');
    // [EN] Result should be Err
    // [RU] Результат должен быть Err
    expect(r.ok).toBe(false);
    if (!r.ok) {
      // [EN] Error message should match
      // [RU] Сообщение об ошибке должно совпадать
      expect(r.error).toBe('Failed');
    }
  });

  // ---------------------
  // Chaining operations
  // ---------------------
  it('✅ Ok → Ok chaining / Цепочка Ok → Ok', () => {
    const r1 = double(3);
    // [EN] Chain another Ok operation
    // [RU] Цепочка ещё одной операции Ok
    const r2 = r1.ok ? double(r1.value) : r1;

    expect(r2.ok).toBe(true);
    if (r2.ok) {
      expect(r2.value).toBe(12);
    }
  });

  it('✅ Ok → Err chaining / Цепочка Ok → Err', () => {
    const r1 = divide(10, 2);
    // [EN] Chain operation that results in Err
    // [RU] Цепочка операции, которая даст Err
    const r2 = r1.ok ? divide(r1.value, 0) : r1;

    expect(r2.ok).toBe(false);
    if (!r2.ok) {
      expect(r2.error).toBe('Division by zero');
    }
  });

  // ---------------------
  // Safe fallback
  // ---------------------
  it('✅ Safe fallback on Err / Безопасный fallback', () => {
    const r = divide(5, 0);
    // [EN] Provide default value in case of Err
    // [RU] Используем значение по умолчанию при Err
    const safeValue = r.ok ? r.value * 2 : 0;
    expect(safeValue).toBe(0);
  });

  // ---------------------
  // Mapping Ok values
  // ---------------------
  it('✅ Map Ok to another Ok / Преобразование Ok в Ok', () => {
    const r = double(7);
    // [EN] Transform Ok value into another Ok
    // [RU] Преобразуем значение Ok в другой Ok
    const mapped = r.ok ? { ok: true, value: `Value: ${r.value}` } : r;

    expect(mapped.ok).toBe(true);
    if (mapped.ok) {
      expect(mapped.value).toBe('Value: 14');
    }
  });

  // ---------------------
  // Edge cases
  // ---------------------
  it('✅ Edge case: division by zero / Граничный случай деления на ноль', () => {
    const r1 = divide(0, 0);
    // [EN] Chain operation with division by zero
    // [RU] Цепочка операции с делением на ноль
    const r2 = r1.ok ? divide(0, 0) : r1;

    expect(r2.ok).toBe(false);
    if (!r2.ok) {
      expect(r2.error).toBe('Division by zero');
    }
  });

  // ---------------------
  // Full integration
  // ---------------------
  it('✅ Full integration: mixed operations / Полная интеграция', () => {
    const r1 = double(5);
    const r2 = r1.ok ? divide(r1.value, 2) : r1;
    const r3 = r2.ok ? divide(r2.value, 0) : r2;
    const r4 = r3.ok ? double(r3.value) : { ok: true, value: 0 };

    expect(r4.ok).toBe(true);
    if (r4.ok) {
      expect(r4.value).toBe(0);
    }
  });

  // ---------------------
  // Type-safety proofs
  // ---------------------
  it('✅ Type-safety: accessing correct fields / Типобезопасность: доступ к полям', () => {
    const okResult: Result<number, string> = { ok: true, value: 123 };
    const errResult: Result<number, string> = { ok: false, error: 'Fail' };

    if (okResult.ok) {
      // [EN] Access value for Ok variant
      // [RU] Доступ к value для Ok варианта
      const v: number = okResult.value;
      expect(v).toBe(123);
      // Uncomment next line to see compile-time error
      // type _ = _ExpectError<typeof okResult.error>;
    }

    if (!errResult.ok) {
      // [EN] Access error for Err variant
      // [RU] Доступ к error для Err варианта
      const e: string = errResult.error;
      expect(e).toBe('Fail');
      // Uncomment next line to see compile-time error
      // type _ = _ExpectError<typeof errResult.value>;
    }
  });

  it('✅ Type-safety: exhaustive switch / Строгий switch', () => {
    const r = divide(10, 2);
    let final: number;

    if (r.ok) {
      // [EN] Ok variant
      // [RU] Вариант Ok
      final = r.value;
    } else {
      // [EN] Err variant
      // [RU] Вариант Err
      final = 0;
    }

    expect(final).toBe(5);
  });

  it('✅ Type-safety: transform Ok preserving types / Преобразование Ok с сохранением типов', () => {
    const r = double(4);
    // [EN] Transform Ok value while preserving types
    // [RU] Преобразуем Ok значение с сохранением типов
    const mapped: Result<string, string> = r.ok
      ? { ok: true, value: `Val:${r.value}` }
      : { ok: false, error: 'Unexpected error' };

    expect(mapped.ok).toBe(true);
    if (mapped.ok) {
      expect(mapped.value).toBe('Val:8');
    }
  });
});


