// __tests__/methods/unwrap.v01.test.ts
import { None, Some, unwrap } from '@resultsafe/core-fp-option';
import { type Option } from '@resultsafe/core-fp-option-shared';
import { describe, expect, it } from 'vitest';

describe('unwrap', () => {
  // ---------------------
  // ✅ [EN] Returns value if Some
  // ✅ [RU] Возвращает значение, если Some
  // ---------------------
  it('✅ [EN] returns value if Some | [RU] возвращает значение, если Some', () => {
    const option: Option<number> = Some(42);
    const result = unwrap(option);

    expect(result).toBe(42);
  });

  // ---------------------
  // ❌ [EN] Throws error if None
  // ❌ [RU] Генерирует ошибку, если None
  // ---------------------
  it('❌ [EN] throws error if None | [RU] выбрасывает ошибку, если None', () => {
    const option: Option<number> = None;

    expect(() => unwrap(option)).toThrowError('Called unwrap on a None value');
  });

  // ---------------------
  // 🔄 [EN] Works with complex types: objects, arrays
  // 🔄 [RU] Работает со сложными типами: объекты, массивы
  // ---------------------
  it('🔄 [EN] works with complex types | [RU] работает со сложными типами', () => {
    const objOption: Option<{ name: string; age: number }> = Some({
      name: 'Alice',
      age: 30,
    });
    const objResult = unwrap(objOption);
    expect(objResult).toEqual({ name: 'Alice', age: 30 });

    const arrOption: Option<number[]> = Some([1, 2, 3]);
    const arrResult = unwrap(arrOption);
    expect(arrResult).toEqual([1, 2, 3]);
  });

  // ---------------------
  // 🧪 [EN] Type narrowing works correctly
  // 🧪 [RU] Уточнение типов работает корректно
  // ---------------------
  it('🧪 [EN] type narrowing works | [RU] корректное уточнение типов', () => {
    type ApiResponse =
      | { status: 200; message: string }
      | { status: 404; error: string };

    const option: Option<ApiResponse> = Some({ status: 200, message: 'OK' });

    const result: ApiResponse = unwrap(option);

    expect(result.status).toBe(200);
    // Проверяем через type guard
    if (result.status === 200) {
      expect(result.message).toBe('OK');
    }
  });

  // ---------------------
  // ⚡ [EN] Real-world usage: user object
  // ⚡ [RU] Реальный сценарий использования: объект пользователя
  // ---------------------
  it('⚡ [EN] unwrap real-world scenario | [RU] unwrap в реальном сценарии', () => {
    type User = { id: number; name: string };
    const optionUser: Option<User> = Some({ id: 1, name: 'Alice' });

    const user: User = unwrap(optionUser);

    expect(user.id).toBe(1);
    expect(user.name).toBe('Alice');
  });

  // ---------------------
  // 🧩 [EN] Nested Option scenario
  // 🧩 [RU] Сценарий с вложенными Option
  // ---------------------
  it('🧩 [EN] works with nested Option | [RU] работает с вложенными Option', () => {
    const nestedSome: Option<Option<string>> = Some(Some('nested'));
    const nestedNone: Option<Option<string>> = Some(None);
    const noneOption: Option<Option<string>> = None;

    const result1 = unwrap(nestedSome); // Option<string>
    const result2 = unwrap(nestedNone);

    // Простая проверка через прямое сравнение структуры
    expect(result1).toEqual({ some: true, value: 'nested' });
    expect(result2).toEqual({ some: false });

    expect(() => unwrap(noneOption)).toThrowError(
      'Called unwrap on a None value',
    );
  });

  // ---------------------
  // 🧪 [EN] Works with async-like fallback (manual unwrap)
  // 🧪 [RU] Работает с эмуляцией асинхронного unwrap
  // ---------------------
  it('🧪 [EN] unwrap simulates async-like scenario | [RU] unwrap эмулирует async', async () => {
    const option: Option<string> = Some('hello');
    const result = unwrap(option);
    expect(result).toBe('hello');
  });
});


