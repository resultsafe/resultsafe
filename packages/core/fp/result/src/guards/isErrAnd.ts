import { type Result } from '../types/core/index.js';
import { isErr } from './isErr.js';

/**
 * Checks that the `Result` resulted in an error and satisfies the predicate.
 *
 * @typeParam T - The success value type.
 * @typeParam E - The error value type.
 * @param result - The `Result` to check.
 * @param predicate - The predicate applied to the error value.
 * @returns `true` when the value is `Err` and the predicate returns `true`.
 * @since 0.1.0
 * @see {@link isErr} - Performs the base error check.
 * @example
 * ```ts
 * import { Err, isErrAnd } from '@resultsafe/core-fp-result';
 *
 * const result = Err({ code: 503 });
 * console.log(isErrAnd(result, (error) => error.code >= 500)); // true
 * ```
 * @public
 */
export const isErrAnd = <T, E>(
  result: Result<T, E>,
  predicate: (error: E) => boolean,
): boolean => isErr(result) && predicate(result.error);
