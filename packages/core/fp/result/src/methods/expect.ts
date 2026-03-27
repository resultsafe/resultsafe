import { isOk } from '../guards/isOk.js';
import { type Result } from '../types/core/index.js';

/**
 * Возвращает успешное значение или выбрасывает исключение с пользовательским сообщением.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @param result - Исходный `Result`.
 * @param msg - Сообщение об ошибке, используемое когда `result` имеет `Err`.
 * @returns Распакованное успешное значение.
 * @throws Error - Выбрасывает исключение, когда `result` имеет `Err`.
 * @since 0.1.0
 * @see {@link expectErr} - Симметричный helper для ветки ошибки.
 * @example
 * ```ts
 * import { Ok, expect } from '@resultsafe/core-fp-result';
 *
 * const value = expect(Ok(5), 'must be ok');
 * console.log(value); // 5
 * ```
 * @public
 */
export const expect = <T, E>(result: Result<T, E>, msg: string): T => {
  if (isOk(result)) {
    return result.value;
  }
  throw new Error(msg);
};
