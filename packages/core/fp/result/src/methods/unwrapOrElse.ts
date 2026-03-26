import { type Result } from '../shared-types.js';

/**
 * Возвращает успешное значение или вычисляет fallback из ошибки.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @param result - Исходный `Result`.
 * @param fn - Функция-поставщик fallback для `Err`.
 * @returns Payload успеха или вычисленный fallback.
 * @since 0.1.0
 * @see {@link unwrapOr} - Использует eager fallback-значение.
 * @example
 * ```ts
 * import { Err, unwrapOrElse } from '@resultsafe/core-fp-result';
 *
 * const value = unwrapOrElse(Err('fatal'), (error) => error.length);
 * console.log(value); // 5
 * ```
 * @public
 */
export const unwrapOrElse = <T, E>(
  result: Result<T, E>,
  fn: (error: E) => T,
): T => {
  if (result.ok) {
    return result.value;
  } else {
    return fn(result.error);
  }
};
