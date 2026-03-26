// Result.Ok.integration.test.ts
import type { Result } from '@resultsafe/core-fp-result-shared';
import { describe, expect, it } from 'vitest';

/**
 * [EN] Example function that always returns a successful result
 * [RU] Пример функции, которая всегда возвращает успешный результат
 */
const doubleNumber = (n: number): Result<number, string> => {
  return { ok: true, value: n * 2 };
};

describe('Result type integration tests — Ok variant / Интеграционные тесты Result — Ok', () => {
  it('✅ Ok returns correct doubled value / Ok возвращает удвоенное значение', () => {
    // [EN] Call doubleNumber with 5
    // [RU] Вызываем doubleNumber с 5
    const result = doubleNumber(5);

    // [EN] Type guard ensures this is Ok
    // [RU] Type guard гарантирует, что это Ok
    if (result.ok) {
      expect(result.value).toBe(10);
    } else {
      // [EN] Should never happen
      // [RU] Не должно выполняться
      throw new Error('Unexpected Err variant');
    }
  });

  it('✅ Can safely perform calculations on Ok / Можно безопасно выполнять вычисления с Ok', () => {
    // [EN] Call doubleNumber with 7
    // [RU] Вызываем doubleNumber с 7
    const result = doubleNumber(7);

    if (result.ok) {
      // [EN] Square the value
      // [RU] Возводим значение в квадрат
      const squared = result.value ** 2;
      expect(squared).toBe(196);
    } else {
      throw new Error('Unexpected Err variant');
    }
  });

  it('✅ Chain operations on Ok / Цепочка операций с Ok', () => {
    // [EN] Function that adds 3 to a number
    // [RU] Функция, которая добавляет 3 к числу
    const addThree = (n: number): Result<number, string> => ({
      ok: true,
      value: n + 3,
    });

    // [EN] Double 4 → 8
    // [RU] Удваиваем 4 → 8
    const result1 = doubleNumber(4);

    if (result1.ok) {
      // [EN] Add 3 → 11
      // [RU] Добавляем 3 → 11
      const result2 = addThree(result1.value);

      if (result2.ok) {
        expect(result2.value).toBe(11); // 4*2 + 3
      } else {
        throw new Error('Unexpected Err variant in chain');
      }
    } else {
      throw new Error('Unexpected Err variant in chain');
    }
  });
});
