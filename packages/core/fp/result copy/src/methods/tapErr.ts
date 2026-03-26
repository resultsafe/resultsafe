import { type Result } from '../shared-types.js';

import { isErr } from '../guards/isErr.js';

/**
 * Выполняет побочный эффект для значения `Err` и возвращает входной `Result`.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @param result - Исходный `Result`.
 * @param fn - Колбэк побочного эффекта для ветки ошибки.
 * @returns Неизмененный `Result`.
 * @since 0.1.0
 * @see {@link tap} - Executes a side effect for the success branch.
 * @example
 * ```ts
 * import { Err, tapErr } from '@resultsafe/core-fp-result';
 *
 * const result = tapErr(Err('boom'), (error) => console.log(error)); // boom
 * console.log(result.ok); // false
 * ```
 * @public
 */
export const tapErr = <T, E>(
  result: Result<T, E>,
  fn: (error: E) => void,
): Result<T, E> => {
  if (isErr(result)) {
    fn(result.error);
  }
  return result;
};


