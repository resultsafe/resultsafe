import type { Result } from '../types/core/index.js';

/**
 * Выполняет побочный эффект для значения `Ok` и возвращает входной `Result`.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @param result - Исходный `Result`.
 * @param fn - Колбэк побочного эффекта для ветки успеха.
 * @returns Неизмененный `Result`.
 * @since 0.1.0
 * @see {@link tapErr} - Executes a side effect for the error branch.
 * @example
 * ```ts
 * import { Ok, tap } from '@resultsafe/core-fp-result';
 *
 * const result = tap(Ok(1), (value) => console.log(value)); // 1
 * console.log(result.ok); // true
 * ```
 * @public
 */
export const tap = <T, E>(
  result: Result<T, E>,
  fn: (value: T) => void,
): Result<T, E> => {
  if (result.ok) {
    fn(result.value);
  }
  return result;
};
