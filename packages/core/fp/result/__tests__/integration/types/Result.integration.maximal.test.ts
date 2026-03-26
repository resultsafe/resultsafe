// Result.integration.maximal.test.ts
import type { Result } from '@resultsafe/core-fp-result-shared';
import { describe, expect, it } from 'vitest';

/**
 * [EN] Function that may succeed or fail depending on the divisor
 * [RU] Функция деления, которая может завершиться успешно или с ошибкой
 */
const divide = (a: number, b: number): Result<number, string> => {
  if (b === 0) {
    return { ok: false, error: 'Division by zero' };
  }
  return { ok: true, value: a / b };
};

/**
 * [EN] Function that always doubles a number
 * [RU] Функция, которая удваивает число
 */
const double = (n: number): Result<number, string> => {
  return { ok: true, value: n * 2 };
};

/**
 * [EN] Function that always returns Err
 * [RU] Функция, которая всегда возвращает Err
 */
const fail = (msg: string): Result<number, string> => {
  return { ok: false, error: msg };
};

/**
 * [EN] Helper type for compile-time type-safety checks
 * [RU] Вспомогательный тип для проверки типобезопасности на этапе компиляции
 */
type _ExpectError<T extends never> = T;

describe('Result full integration / Полная интеграция Result', () => {
  // ---------------------
  // Ok chaining
  // ---------------------
  it('✅ Ok chaining multiple operations / Цепочка нескольких Ok', () => {
    const r1 = double(2);
    const r2 = r1.ok ? double(r1.value) : r1;
    const r3 = r2.ok ? double(r2.value) : r2;

    expect(r3.ok).toBe(true);
    if (r3.ok) {
      expect(r3.value).toBe(16);
    }
  });

  // ---------------------
  // Mixed Ok → Err chaining
  // ---------------------
  it('✅ Mixed Ok and Err chaining / Смешанная цепочка Ok и Err', () => {
    const r1 = divide(10, 2);
    const r2 = r1.ok ? divide(r1.value, 0) : r1;
    const r3 = r2;

    expect(r3.ok).toBe(false);
    if (!r3.ok) {
      expect(r3.error).toBe('Division by zero');
    }
  });

  // ---------------------
  // Safe fallback for Err
  // ---------------------
  it('✅ Safe fallback for Err in chain / Безопасный fallback для Err в цепочке', () => {
    const r1 = divide(8, 0);
    const r2 = r1.ok ? double(r1.value) : { ok: true, value: 0 };

    expect(r2.ok).toBe(true);
    if (r2.ok) {
      expect(r2.value).toBe(0);
    }
  });

  // ---------------------
  // Transform Ok → Ok
  // ---------------------
  it('✅ Transform Ok → Ok with different type / Преобразование Ok в Ok другого типа', () => {
    const r = double(7);
    const mapped = r.ok
      ? { ok: true, value: `Value: ${r.value}` }
      : { ok: false, error: 'Unexpected error' };

    expect(mapped.ok).toBe(true);
    if (mapped.ok) {
      expect(mapped.value).toBe('Value: 14');
    }
  });

  // ---------------------
  // Transform Err → Err
  // ---------------------
  it('✅ Transform Err → Err with different message / Преобразование Err в Err с другим сообщением', () => {
    const r = fail('Initial fail');
    const mapped = !r.ok ? { ok: false, error: `Mapped: ${r.error}` } : r;

    expect(mapped.ok).toBe(false);
    if (!mapped.ok) {
      expect(mapped.error).toBe('Mapped: Initial fail');
    }
  });

  // ---------------------
  // Mixed types chaining
  // ---------------------
  it('✅ Mixed type chaining / Цепочка с разными типами', () => {
    const r1 = double(3);
    const r2: Result<string, string> = r1.ok
      ? { ok: true, value: `Value is ${r1.value}` }
      : { ok: false, error: 'Unexpected error' };

    // [EN] Transform string to boolean if Ok
    // [RU] Преобразуем строку в boolean, если Ok
    const r3 = r2.ok
      ? { ok: true, value: r2.value.length > 5 }
      : { ok: false, error: 'Unexpected error' };

    expect(r3.ok).toBe(true);
    if (r3.ok) {
      expect(r3.value).toBe(true);
    }
  });

  // ---------------------
  // Type-safety assertions
  // ---------------------
  it('✅ Type-safety: accessing correct fields / Типобезопасность: доступ к полям', () => {
    const okResult: Result<number, string> = { ok: true, value: 10 };
    const errResult: Result<number, string> = { ok: false, error: 'Fail' };

    if (okResult.ok) {
      // [EN] Access value for Ok variant
      // [RU] Доступ к value для Ok варианта
      const v: number = okResult.value;
      expect(v).toBe(10);
      // type _ = _ExpectError<typeof okResult.error>; // Uncomment to test TS safety
    }

    if (!errResult.ok) {
      // [EN] Access error for Err variant
      // [RU] Доступ к error для Err варианта
      const e: string = errResult.error;
      expect(e).toBe('Fail');
      // type _ = _ExpectError<typeof errResult.value>; // Uncomment to test TS safety
    }
  });

  // ---------------------
  // Exhaustive if/else
  // ---------------------
  it('✅ Exhaustive if/else for Ok/Err / Строгий if/else для Ok/Err', () => {
    const r = divide(10, 5);
    let finalValue: number;

    if (r.ok) {
      // [EN] Ok variant
      // [RU] Вариант Ok
      finalValue = r.value;
    } else {
      // [EN] Err variant
      // [RU] Вариант Err
      finalValue = 0;
    }

    expect(finalValue).toBe(2);
  });

  // ---------------------
  // Complex chain with multiple fallbacks
  // ---------------------
  it('✅ Complex chain with multiple fallbacks / Сложная цепочка с fallback', () => {
    const r1 = divide(10, 2);
    const r2 = r1.ok ? divide(r1.value, 0) : r1;
    const r3 = r2.ok ? double(r2.value) : { ok: true, value: -1 };

    expect(r3.ok).toBe(true);
    if (r3.ok) {
      expect(r3.value).toBe(-1);
    }
  });

  // ---------------------
  // Nested transformations
  // ---------------------
  it('✅ Nested transformations Ok → Ok → Err → fallback / Вложенные трансформации', () => {
    const r1 = double(4);
    const r2 = r1.ok
      ? r1.value > 5
        ? fail('Value too big')
        : double(r1.value)
      : r1;

    const r3 = r2.ok
      ? { ok: true, value: `Result: ${r2.value}` }
      : { ok: true, value: 'Fallback' };

    expect(r3.ok).toBe(true);
    if (r3.ok) {
      expect(r3.value).toBe('Fallback');
    }
  });
});
