import { isOk } from '../guards/isOk.js';
import { type Result } from '../types/core/index.js';

/**
 * Возвращает успешное значение или выбрасывает исключение, если результат `Err`.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @param result - Исходный `Result`.
 * @returns Payload успеха.
 * @throws Error - Выбрасывает исключение при вызове на `Err`.
 * @since 0.1.0
 * @see {@link unwrapOr} - Возвращает fallback вместо выброса исключения.
 * @example
 * ```ts
 * import { Ok, unwrap } from '@resultsafe/core-fp-result';
 *
 * const value = unwrap(Ok(9));
 * console.log(value); // 9
 * ```
 * @public
 */
export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (isOk(result)) {
    return result.value;
  }
  throw new Error('Called unwrap on an Err value');
};
