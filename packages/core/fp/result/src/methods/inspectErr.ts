import { isErr } from '../guards/isErr.js';
import { type Result } from '../types/core/index.js';

/**
 * Выполняет побочный эффект для значения ошибки и возвращает исходный `Result`.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @param result - Исходный `Result`.
 * @param fn - Функция побочного эффекта для ветки ошибки.
 * @returns Тот же экземпляр `Result`.
 * @since 0.1.0
 * @see {@link tapErr} - Эквивалентный helper для ветки ошибки.
 * @example
 * ```ts
 * import { Err, inspectErr } from '@resultsafe/core-fp-result';
 *
 * const result = inspectErr(Err('boom'), (error) => console.log(error)); // boom
 * console.log(result.ok); // false
 * ```
 * @public
 */
export const inspectErr = <T, E>(
  result: Result<T, E>,
  fn: (error: E) => void,
): Result<T, E> => {
  if (isErr(result)) {
    fn(result.error);
  }
  return result;
};
