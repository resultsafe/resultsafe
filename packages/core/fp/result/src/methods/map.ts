import { isOk } from '../guards/isOk.js';
import { type Result } from '../types/core/index.js';

/**
 * Преобразует успешное значение, сохраняя ветку ошибки.
 *
 * @typeParam T - Тип входного успешного значения.
 * @typeParam U - Тип выходного успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @param result - Исходный `Result`.
 * @param fn - Функция преобразования успешного значения.
 * @returns Преобразованный `Ok` или исходный `Err`.
 * @since 0.1.0
 * @see {@link mapErr} - Преобразует ветку ошибки.
 * @example
 * ```ts
 * import { Ok, map } from '@resultsafe/core-fp-result';
 *
 * const result = map(Ok(2), (value) => value * 10);
 * console.log(result.ok); // true
 * ```
 * @public
 */
export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> =>
  isOk(result)
    ? { ok: true, value: fn(result.value) }
    : (result as Result<U, E>);
