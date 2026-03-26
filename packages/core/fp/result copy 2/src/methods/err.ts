import { type Option } from '../shared-types.js';
import { type Result } from '../shared-types.js';

import { isErr } from '../guards/isErr.js';
import { None, Some } from '../internal/option.js';

/**
 * Извлекает ветку ошибки в виде `Option`.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @param result - Исходный `Result`.
 * @returns `Some(error)` для `Err`, иначе `None`.
 * @since 0.1.0
 * @see {@link ok} - Извлекает ветку успеха.
 * @example
 * ```ts
 * import { Err, err } from '@resultsafe/core-fp-result';
 *
 * const value = err(Err('boom'));
 * console.log(value.some); // true
 * ```
 * @public
 */
export const err = <T, E>(result: Result<T, E>): Option<E> =>
  isErr(result) ? Some(result.error) : None;


