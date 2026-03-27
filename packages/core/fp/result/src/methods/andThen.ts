import { isOk } from '../guards/isOk.js';
import { type Result } from '../types/core/index.js';

/**
 * Цепляет вычисление, которое возвращает другой `Result`.
 *
 * @typeParam T - The input success type.
 * @typeParam U - The output success type.
 * @typeParam E - Общий тип ошибки.
 * @param result - Исходный `Result`.
 * @param fn - Функция, применяемая, когда `result` имеет `Ok`.
 * @returns Преобразованный `Result` или исходный `Err`.
 * @since 0.1.0
 * @see {@link map} - Преобразует только успешное значение.
 * @example
 * ```ts
 * import { Ok, Err, andThen } from '@resultsafe/core-fp-result';
 *
 * const parsed = andThen(Ok('12'), (value) => {
 *   const n = Number(value);
 *   return Number.isNaN(n) ? Err('invalid') : Ok(n);
 * });
 * console.log(parsed.ok); // true
 * ```
 * @public
 */
export const andThen = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> => (isOk(result) ? fn(result.value) : (result as Result<U, E>));
