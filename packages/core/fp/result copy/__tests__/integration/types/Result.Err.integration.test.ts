// Result.Err.integration.test.ts
import type { Result } from '@resultsafe/core-fp-result-shared';
import { describe, expect, it } from 'vitest';

/**
 * [EN] Example function that can fail
 * [RU] Пример функции, которая может завершиться ошибкой
 */
const divide = (a: number, b: number): Result<number, string> => {
  if (b === 0) {
    return { ok: false, error: 'Division by zero' };
  }
  return { ok: true, value: a / b };
};

describe('Result type integration tests — Err variant / Интеграционные тесты Result — Err', () => {
  it('❌ Err occurs on division by zero / Err возникает при делении на ноль', () => {
    const result = divide(10, 0);

    // [EN] Type guard for Err
    // [RU] Type guard для Err
    if (!result.ok) {
      // [EN] Check error message
      // [RU] Проверяем сообщение об ошибке
      expect(result.error).toBe('Division by zero');
    } else {
      throw new Error('Unexpected Ok result');
    }
  });

  it('✅ Can safely fallback on Err / Можно безопасно использовать fallback при Err', () => {
    const result = divide(5, 0);

    // [EN] Use default value if Err
    // [RU] Используем значение по умолчанию при Err
    const safeValue = result.ok ? result.value : 0;

    expect(safeValue).toBe(0);
  });

  it('✅ Chain multiple Errs safely / Безопасная цепочка с несколькими Err', () => {
    const safeDivide = (a: number, b: number): Result<number, string> =>
      divide(a, b);

    const result1 = safeDivide(10, 0);

    // [EN] Chain another division safely
    // [RU] Безопасно цепляем второе деление
    const result2 = !result1.ok ? safeDivide(0, 0) : result1;

    if (!result2.ok) {
      expect(result2.error).toBe('Division by zero');
    } else {
      throw new Error('Unexpected Ok result');
    }
  });

  it('✅ Chain Err then Ok safely / Цепочка Err → Ok с безопасным fallback', () => {
    const safeDivide = (a: number, b: number): Result<number, string> =>
      divide(a, b);

    const result1 = safeDivide(10, 0);

    // [EN] Provide a fallback Ok if previous result was Err
    // [RU] Используем fallback Ok, если предыдущий результат Err
    const result2 = result1.ok
      ? safeDivide(result1.value, 2)
      : { ok: true, value: 0 };

    if (result2.ok) {
      expect(result2.value).toBe(0);
    } else {
      throw new Error('Unexpected Err result');
    }
  });
});


