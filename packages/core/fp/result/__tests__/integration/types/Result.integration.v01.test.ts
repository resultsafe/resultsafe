// Result.integration.v01.test.ts
// Result.integration.v01.test.ts
import type { Result } from '@resultsafe/core-fp-result-shared';
import { describe, expect, it } from 'vitest';

/**
 * [EN] Example function that may succeed or fail
 * [RU] Пример функции, которая может завершиться успешно или с ошибкой
 */
const divide = (a: number, b: number): Result<number, string> => {
  if (b === 0) {
    return { ok: false, error: 'Division by zero' };
  }
  return { ok: true, value: a / b };
};

describe('Result type integration tests / Интеграционные тесты Result', () => {
  it('✅ Division succeeds / Деление успешно', () => {
    // [EN] Divide 10 by 2
    // [RU] Делим 10 на 2
    const result = divide(10, 2);

    // [EN] Type guard for Ok
    // [RU] Type guard для Ok
    if (result.ok) {
      // [EN] Check that the result value is correct
      // [RU] Проверяем, что результат верный
      expect(result.value).toBe(5);
    } else {
      // [EN] Should never reach here
      // [RU] Не должно выполняться
      throw new Error('Unexpected Err variant');
    }
  });

  it('❌ Division by zero fails / Деление на ноль возвращает ошибку', () => {
    // [EN] Divide 10 by 0 to trigger error
    // [RU] Делим 10 на 0, чтобы получить ошибку
    const result = divide(10, 0);

    // [EN] Type guard for Err
    // [RU] Type guard для Err
    if (!result.ok) {
      // [EN] Check the error message
      // [RU] Проверяем сообщение об ошибке
      expect(result.error).toBe('Division by zero');
    } else {
      throw new Error('Unexpected Ok variant');
    }
  });

  it('✅ Map over Ok variant / Применяем операцию к Ok', () => {
    // [EN] Divide 8 by 2
    // [RU] Делим 8 на 2
    const result = divide(8, 2);

    if (result.ok) {
      // [EN] Double the Ok value
      // [RU] Удваиваем значение Ok
      const doubled = result.value * 2;
      expect(doubled).toBe(8);
    } else {
      throw new Error('Unexpected Err variant');
    }
  });

  it('✅ Handle Err variant gracefully / Обработка Err без падения', () => {
    // [EN] Divide 8 by 0 to get an error
    // [RU] Делим 8 на 0, чтобы получить ошибку
    const result = divide(8, 0);

    // [EN] Provide a fallback value if error occurs
    // [RU] Используем значение по умолчанию при Err
    const handled = result.ok ? result.value * 2 : 0;
    expect(handled).toBe(0);
  });
});
