import { isOk } from '../guards/isOk.js';
import { type Result } from '../types/core/index.js';

/**
 * Возвращает успешное значение или переданный fallback по умолчанию.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @param result - Исходный `Result`.
 * @param defaultValue - Fallback-значение для `Err`.
 * @returns Payload успеха или `defaultValue`.
 * @since 0.1.0
 * @see {@link unwrapOrElse} - Вычисляет fallback лениво.
 * @example
 * ```ts
 * import { Err, unwrapOr } from '@resultsafe/core-fp-result';
 *
 * const value = unwrapOr(Err('boom'), 0);
 * console.log(value); // 0
 * ```
 * @public
 */
export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T =>
  isOk(result) ? result.value : defaultValue;
