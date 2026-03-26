import { Left, mapLeft, Right } from '@resultsafe/core-fp-either';
import { expectType } from 'tsd';
import { describe, expect, it } from 'vitest';

//
// 3️⃣ Тесты с Left/Right
//
describe('mapLeft 🌈 / mapLeft тест', () => {
  it('should map Left value ✅ / должно преобразовать Left', () => {
    const value = Left<number, string>(5);

    const result = mapLeft(value, (x) => x * 2);

    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left).toBe(10);
      expectType<number>(result.left);
    }
  });

  it('should leave Right unchanged ✅ / Right остается без изменений', () => {
    const value = Right<string, number>('ok');

    const result = mapLeft(value, (x) => x * 2);

    expect(result._tag).toBe('Right');
    if (result._tag === 'Right') {
      expect(result.right).toBe('ok');
      expectType<string>(result.right);
    }
  });

  it('should work with complex Left types ✅ / работает со сложными типами Left', () => {
    type Err = { code: number; message: string };
    const value = Left<Err, string>({ code: 404, message: 'Not found' });

    const result = mapLeft(value, (e) => e.message.toUpperCase());

    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left).toBe('NOT FOUND');
      expectType<string>(result.left);
    }
  });

  it('should not affect Right even with complex Left ✅ / Right не изменяется при сложном Left', () => {
    type Err = { code: number; message: string };
    const value = Right<{ data: number[] }, Err>({ data: [1, 2, 3] });

    const result = mapLeft(value, (e) => e.message);

    expect(result._tag).toBe('Right');
    if (result._tag === 'Right') {
      expect(result.right.data).toEqual([1, 2, 3]);
      expectType<{ data: number[] }>(result.right);
    }
  });

  it('real-world scenario: API error handling 🌐 / реальный кейс: обработка ошибок API', () => {
    type ApiError = { status: number; text: string };
    const response = Left<ApiError, { userId: string }>({
      status: 500,
      text: 'Server error',
    });

    const mapped = mapLeft(
      response,
      (err) => `Error ${err.status}: ${err.text}`,
    );

    expect(mapped._tag).toBe('Left');
    if (mapped._tag === 'Left') {
      expect(mapped.left).toBe('Error 500: Server error');
      expectType<string>(mapped.left);
    }
  });

  it('real-world scenario: business logic check 💼 / реальный кейс: проверка бизнес-логики', () => {
    type BusinessErr = 'insufficient_funds' | 'blocked_account';
    const transaction = Left<BusinessErr, { success: boolean }>(
      'insufficient_funds',
    );

    const mapped = mapLeft(transaction, (err) =>
      err === 'blocked_account' ? 'Blocked' : 'Not enough money',
    );

    expect(mapped._tag).toBe('Left');
    if (mapped._tag === 'Left') {
      expect(mapped.left).toBe('Not enough money');
      expectType<string>(mapped.left);
    }
  });
});


