// Result.integration.full.v01.test.ts
import type { Result } from '@resultsafe/core-fp-result-shared';
import { describe, expect, it } from 'vitest';

/**
 * Функция, которая может завершиться успешно или с ошибкой в зависимости от делителя
 */
const divide = (a: number, b: number): Result<number, string> =>
  b === 0
    ? { ok: false, error: 'Division by zero' }
    : { ok: true, value: a / b };

/**
 * Функция, которая всегда удваивает число и возвращает результат Ok
 */
const double = (n: number): Result<number, string> => ({
  ok: true,
  value: n * 2,
});

/**
 * Функция, которая всегда возвращает результат Err с сообщением
 */
const fail = (msg: string): Result<number, string> => ({
  ok: false,
  error: msg,
});

describe('Result full integration tests / Полные интеграционные тесты Result', () => {
  // ---------------------
  // Basic Ok / Err checks
  // ---------------------
  it('✅ Ok contains value / Ok содержит value', () => {
    const r = double(5);

    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value).toBe(10);
    }
  });

  it('❌ Err contains error / Err содержит error', () => {
    const r = fail('Failed');

    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error).toBe('Failed');
    }
  });

  // ---------------------
  // Chaining Ok operations
  // ---------------------
  it('✅ Ok → Ok chaining / Цепочка Ok → Ok', () => {
    const r1 = double(3);
    const r2 = r1.ok ? double(r1.value) : r1;

    expect(r2.ok).toBe(true);
    if (r2.ok) {
      expect(r2.value).toBe(12);
    }
  });

  // ---------------------
  // Chaining mixed Ok and Err
  // ---------------------
  it('✅ Ok → Err chaining / Цепочка Ok → Err', () => {
    const r1 = divide(10, 2);
    const r2 = r1.ok ? divide(r1.value, 0) : r1;

    expect(r2.ok).toBe(false);
    if (!r2.ok) {
      expect(r2.error).toBe('Division by zero');
    }
  });

  // ---------------------
  // Safe fallback on Err
  // ---------------------
  it('✅ Safe fallback / Безопасный fallback при Err', () => {
    const r = divide(5, 0);
    const safeValue = r.ok ? r.value * 2 : 0;

    expect(safeValue).toBe(0);
  });

  // ---------------------
  // Complex chain with fallback
  // ---------------------
  it('✅ Complex chain with fallback / Сложная цепочка с fallback', () => {
    const r1 = divide(8, 2);
    const r2 = r1.ok ? divide(r1.value, 0) : r1;
    const finalValue = r2.ok ? r2.value * 3 : 0;

    expect(finalValue).toBe(0);
  });

  // ---------------------
  // Mapping Ok values
  // ---------------------
  it('✅ Transform Ok to another Ok / Преобразование Ok в другой Ok', () => {
    const r = double(7);
    const mapped = r.ok ? { ok: true, value: `Value: ${r.value}` } : r;

    expect(mapped.ok).toBe(true);
    if (mapped.ok) {
      expect(mapped.value).toBe('Value: 14');
    }
  });

  // ---------------------
  // Edge cases
  // ---------------------
  it('✅ Edge case: division by zero in chain / Граничный случай: деление на ноль в цепочке', () => {
    const r1 = divide(0, 0);
    const r2 = r1.ok ? divide(0, 0) : r1;

    expect(r2.ok).toBe(false);
    if (!r2.ok) {
      expect(r2.error).toBe('Division by zero');
    }
  });

  // ---------------------
  // Integration: multiple mixed operations
  // ---------------------
  it('✅ Full integration: multiple mixed operations / Полная интеграция: смешанные операции', () => {
    const r1 = double(5);
    const r2 = r1.ok ? divide(r1.value, 2) : r1;
    const r3 = r2.ok ? divide(r2.value, 0) : r2;
    const r4 = r3.ok ? double(r3.value) : { ok: true, value: 0 };

    expect(r4.ok).toBe(true);
    if (r4.ok) {
      expect(r4.value).toBe(0);
    }
  });
});


