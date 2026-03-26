import { isOk } from '../guards/isOk.js';
import { type Result } from '../shared-types.js';

/**
 * Выполняет побочный эффект для успешного значения и возвращает исходный `Result`.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @param result - Исходный `Result`.
 * @param fn - Функция побочного эффекта для ветки успеха.
 * @returns Тот же экземпляр `Result`.
 * @since 0.1.0
 * @see {@link tap} - Эквивалентный helper для ветки успеха.
 * @example
 * ```ts
 * import { Ok, inspect } from '@resultsafe/core-fp-result';
 *
 * const result = inspect(Ok(1), (value) => console.log(value)); // 1
 * console.log(result.ok); // true
 * ```
 * @public
 */
export const inspect = <T, E>(
  result: Result<T, E>,
  fn: (value: T) => void,
): Result<T, E> => {
  if (isOk(result)) {
    fn(result.value);
  }
  return result;
};
