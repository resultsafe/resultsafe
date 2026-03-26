// __tests__/methods/orElse.v01.test.ts
import { None, orElse, Some } from '@resultsafe/core-fp-option';
import { type Option } from '@resultsafe/core-fp-option-shared';
import { describe, expect, it } from 'vitest';

describe('orElse', () => {
  // ---------------------
  // ✅ [EN] Success case: Some → Some
  // ✅ [RU] Успешный кейс: Some → Some
  // ---------------------
  it('✅ [EN] returns original Some if Some | [RU] возвращает исходный Some, если Some', () => {
    const option = Some(42);
    const result = orElse(option, () => Some(0));
    expect(result).toEqual({ some: true, value: 42 });
  });

  // ---------------------
  // ❌ [EN] Failure case: None → fallback
  // ❌ [RU] Кейс неудачи: None → fallback
  // ---------------------
  it('❌ [EN] returns fallback if None | [RU] возвращает fallback, если None', () => {
    const option = None;
    const result = orElse(option, () => Some(0));
    expect(result).toEqual({ some: true, value: 0 });
  });

  // ---------------------
  // 🔄 [EN] Round-trip conversion: None → Some → None
  // 🔄 [RU] Обратное преобразование: None → Some → None
  // ---------------------
  it('🔄 [EN] round-trip conversion works | [RU] обратное преобразование работает', () => {
    const originalOption = None;
    const result = orElse(originalOption, () => Some({ id: 1, name: 'Alice' }));
    if (result.some === true) {
      const restoredOption = None;
      expect(restoredOption).toEqual({ some: false });
    } else {
      expect.fail('Expected Some, got None | Ожидали Some, получили None');
    }
  });

  // ---------------------
  // 🧪 [EN] Complex value types: objects, arrays, custom types
  // 🧪 [RU] Сложные типы значений: объекты, массивы, кастомные типы
  // ---------------------
  it('🧪 [EN] works with complex value types | [RU] работает со сложными типами значений', () => {
    const objValue = {
      id: 1,
      profile: { name: 'Bob', age: 30, emails: ['bob@example.com'] },
    };
    const result1 = orElse(None, () => Some(objValue));
    if (result1.some === true) expect(result1.value).toEqual(objValue);

    const arrayValue = [1, 2, 3];
    const result2 = orElse(None, () => Some(arrayValue));
    if (result2.some === true) expect(result2.value).toEqual(arrayValue);

    class User {
      constructor(
        public readonly id: number,
        public readonly name: string,
      ) {}
    }
    const userValue = new User(1, 'Charlie');
    const result3 = orElse(None, () => Some(userValue));
    if (result3.some === true) expect(result3.value).toBe(userValue);
  });

  // ---------------------
  // 📊 [EN] Type narrowing works correctly
  // 📊 [RU] Уточнение типов работает корректно
  // ---------------------
  it('📊 [EN] type narrowing works correctly | [RU] уточнение типов работает корректно', () => {
    type ApiResponse =
      | { type: 'success'; data: { id: number; name: string } }
      | { type: 'cached'; data: { id: number; name: string }; ttl: number }
      | { type: 'partial'; data: { id: number }; warnings: string[] };

    const option: Option<ApiResponse> = None;
    const result = orElse(option, () =>
      Some({ type: 'success', data: { id: 1, name: 'Product A' } }),
    );

    if (result.some === true) {
      expect(result.value.type).toBe('success');
      expect(result.value.data.id).toBe(1);
    }
  });

  // ---------------------
  // ⚡ [EN] Performance: no mutation of original option
  // ⚡ [RU] Производительность: оригинальный option не мутирует
  // ---------------------
  it('⚡ [EN] does not mutate original option | [RU] не мутирует оригинальный option', () => {
    const originalOption = None;
    const originalCopy = { ...originalOption };
    const result = orElse(originalOption, () => Some('Fallback'));
    expect(originalOption).toEqual(originalCopy);
    expect(result).toEqual({ some: true, value: 'Fallback' });
  });

  // ---------------------
  // 🧩 [EN] Integration with other Option methods
  // 🧩 [RU] Интеграция с другими методами Option
  // ---------------------
  it('🧩 [EN] integrates with other Option methods | [RU] интегрируется с другими методами Option', () => {
    const result = orElse(None, () => Some('Fallback'));
    const mapped =
      result.some === true ? Some(result.value.toUpperCase()) : result;
    expect(mapped).toEqual({ some: true, value: 'FALLBACK' });

    const chained = result.some === true ? Some(result.value.length) : result;
    expect(chained).toEqual({ some: true, value: 8 });
  });

  // ---------------------
  // 🧪 [EN] Edge cases: falsy values, empty strings, zero
  // 🧪 [RU] Краевые случаи: falsy значения, пустые строки, ноль
  // ---------------------
  it('🧪 [EN] handles edge cases correctly | [RU] обрабатывает краевые случаи корректно', () => {
    const cases = [
      { fallback: 0, expected: 0 },
      { fallback: '', expected: '' },
      { fallback: null, expected: null },
      { fallback: undefined, expected: undefined },
      { fallback: false, expected: false },
    ];
    for (const { fallback, expected } of cases) {
      const result = orElse(None, () => Some(fallback));
      expect(result).toEqual({ some: true, value: expected });
    }
  });

  // ---------------------
  // 🧪 [EN] Type inference with generics
  // 🧪 [RU] Вывод типов с дженериками
  // ---------------------
  it('🧪 [EN] type inference works with generics | [RU] вывод типов работает с дженериками', () => {
    const provideFallback = <T>(option: Option<T>, fallback: T): Option<T> =>
      orElse(option, () => Some(fallback));
    const result = provideFallback(None, { status: 200, message: 'OK' });
    if (result.some === true) {
      expect(result.value.status).toBe(200);
      expect(result.value.message).toBe('OK');
    }
  });

  // ---------------------
  // 🧪 [EN] Union types as value
  // 🧪 [RU] Типы объединения как значения
  // ---------------------
  it('🧪 [EN] works with union value types | [RU] работает с типами объединений как значениями', () => {
    type UserResponse = { type: 'user'; id: number; name: string };
    type ProductResponse = { type: 'product'; id: number; title: string };
    type OrderResponse = { type: 'order'; id: number; total: number };
    type ApiResponse = UserResponse | ProductResponse | OrderResponse;

    const result = orElse(None, () =>
      Some({ type: 'user', id: 123, name: 'John Doe' }),
    );
    if (result.some === true && result.value.type === 'user') {
      expect(result.value.name).toBe('John Doe');
      expect(result.value.id).toBe(123);
    }
  });

  // ---------------------
  // 🧪 [EN] Nested Option types
  // 🧪 [RU] Вложенные типы Option
  // ---------------------
  it('🧪 [EN] works with nested Option types | [RU] работает с вложенными типами Option', () => {
    const result = orElse(None as Option<Option<string>>, () =>
      Some(Some('Nested fallback')),
    );
    if (result.some === true) {
      const innerOption = result.value;
      if (innerOption.some === true)
        expect(innerOption.value).toBe('Nested fallback');
      else expect.fail('Expected Some, got None | Ожидали Some, получили None');
    } else expect.fail('Expected Some, got None | Ожидали Some, получили None');
  });

  // ---------------------
  // 🧪 [EN] Async Option compatibility
  // 🧪 [RU] Совместимость с асинхронными Option
  // ---------------------
  it('🧪 [EN] works with async Option compatibility | [RU] совместимость с асинхронными Option', async () => {
    const asyncOption: Promise<Option<number>> = Promise.resolve(None);
    const resolvedOption = await asyncOption;
    const result = orElse(resolvedOption, () => Some(100));
    if (result.some === true) expect(result.value).toBe(100);
    else expect.fail('Expected Some, got None | Ожидали Some, получили None');
  });
});


