import { type Option } from '../shared-types.js';
import { type Result } from '../shared-types.js';

import { isOk } from '../guards/isOk.js';
import { None, Some } from '../internal/option.js';

/**
 * Извлекает успешную ветку в виде `Option`.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @param result - Исходный `Result`.
 * @returns `Some(value)` для `Ok`, иначе `None`.
 * @since 0.1.0
 * @see {@link err} - Извлекает ветку ошибки.
 * @example
 * ```ts
 * import { Ok, ok } from '@resultsafe/core-fp-result';
 *
 * const value = ok(Ok(10));
 * console.log(value.some); // true
 * ```
 * @public
 */
export const ok = <T, E>(result: Result<T, E>): Option<T> =>
  isOk(result) ? Some(result.value) : None;


