import { isErr } from '../guards/isErr.js';
import { type Result } from '../types/core/index.js';

/**
 * Восстанавливается из ошибки, преобразуя `Err` в другой `Result`.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип входного значения ошибки.
 * @typeParam F - Тип выходного значения ошибки.
 * @param result - Исходный `Result`.
 * @param fn - Функция восстановления, применяемая для `Err`.
 * @returns Восстановленный `Result` или исходный `Ok`.
 * @since 0.1.0
 * @see {@link andThen} - Цепляет ветку успеха.
 * @example
 * ```ts
 * import { Err, Ok, orElse } from '@resultsafe/core-fp-result';
 *
 * const result = orElse(Err('network'), () => Ok('cached'));
 * console.log(result.ok); // true
 * ```
 * @public
 */
export const orElse = <T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => Result<T, F>,
): Result<T, F> =>
  isErr(result) ? fn(result.error) : (result as Result<T, F>);
