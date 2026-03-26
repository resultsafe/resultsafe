import { None, Some } from '../internal/option.js';
import { type Option } from '../shared-types.js';
import { type Result } from '../shared-types.js';

/**
 * Преобразует `Result<Option<T>, E>` в `Option<Result<T, E>>`.
 *
 * @typeParam T - The success value type inside `Option`.
 * @typeParam E - Тип значения ошибки.
 * @param result - Исходный `Result`, содержащий `Option`.
 * @returns Транспонированный `Option<Result<T, E>>`.
 * @since 0.1.0
 * @see {@link flatten} - Collapses nested `Result` values.
 * @example
 * ```ts
 * import { Ok, transpose } from '@resultsafe/core-fp-result';
 *
 * const value = transpose(Ok({ some: true, value: 2 }));
 * console.log(value.some); // true
 * ```
 * @public
 */
export const transpose = <T, E>(
  result: Result<Option<T>, E>,
): Option<Result<T, E>> => {
  if (result.ok) {
    return result.value.some === true
      ? Some({ ok: true, value: result.value.value })
      : None;
  }
  return Some({ ok: false, error: result.error });
};
