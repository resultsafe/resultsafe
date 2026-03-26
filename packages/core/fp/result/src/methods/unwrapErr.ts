import { isErr } from '../guards/isErr.js';
import { type Result } from '../shared-types.js';

/**
 * Возвращает значение ошибки или выбрасывает исключение, если результат `Ok`.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @param result - Исходный `Result`.
 * @returns Payload ошибки.
 * @throws Error - Выбрасывает исключение при вызове на `Ok`.
 * @since 0.1.0
 * @see {@link unwrapOrElse} - Возвращает fallback успеха без выброса исключения.
 * @example
 * ```ts
 * import { Err, unwrapErr } from '@resultsafe/core-fp-result';
 *
 * const error = unwrapErr(Err('boom'));
 * console.log(error); // boom
 * ```
 * @public
 */
export const unwrapErr = <T, E>(result: Result<T, E>): E => {
  if (isErr(result)) {
    return result.error;
  }
  throw new Error('Called unwrapErr on an Ok value');
};
