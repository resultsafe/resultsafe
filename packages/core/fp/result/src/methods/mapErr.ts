import { type Result } from '../shared-types.js';

import { isErr } from '../guards/isErr.js';

/**
 * Преобразует значение ошибки, сохраняя ветку успеха.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип входного значения ошибки.
 * @typeParam F - Тип выходного значения ошибки.
 * @param result - Исходный `Result`.
 * @param fn - Функция преобразования значения ошибки.
 * @returns Преобразованный `Err` или исходный `Ok`.
 * @since 0.1.0
 * @see {@link map} - Transforms the success branch.
 * @example
 * ```ts
 * import { Err, mapErr } from '@resultsafe/core-fp-result';
 *
 * const result = mapErr(Err('e1'), (error) => `mapped:${error}`);
 * console.log(result.ok); // false
 * ```
 * @public
 */
export const mapErr = <T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F,
): Result<T, F> =>
  isErr(result)
    ? { ok: false, error: fn(result.error) }
    : (result as Result<T, F>);


