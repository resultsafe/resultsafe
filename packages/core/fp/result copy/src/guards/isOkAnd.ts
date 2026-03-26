import { type Result } from '../shared-types.js';

import { isOk } from './isOk.js';

/**
 * Проверяет, что `Result` успешен и удовлетворяет предикату.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @param result - `Result` для проверки.
 * @param predicate - Предикат, применяемый к успешному значению.
 * @returns `true` when the value is `Ok` and the predicate returns `true`.
 * @since 0.1.0
 * @see {@link isOk} - Performs the base success check.
 * @example
 * ```ts
 * import { Ok, isOkAnd } from '@resultsafe/core-fp-result';
 *
 * const result = Ok(8);
 * console.log(isOkAnd(result, (value) => value % 2 === 0)); // true
 * ```
 * @public
 */
export const isOkAnd = <T, E>(
  result: Result<T, E>,
  predicate: (value: T) => boolean,
): boolean => isOk(result) && predicate(result.value);


