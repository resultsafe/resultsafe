import { isOk } from '../guards/isOk.js';
import { type Result } from '../types/core/index.js';

/**
 * Transforms the success value while preserving the error branch.
 *
 * @typeParam T - The input success value type.
 * @typeParam U - The output success value type.
 * @typeParam E - The error value type.
 * @param result - The source `Result`.
 * @param fn - The transformation function for the success value.
 * @returns The transformed `Ok` or the original `Err`.
 * @since 0.1.0
 * @see {@link mapErr} - Transforms the error branch.
 * @example
 * ```ts
 * import { Ok, map } from '@resultsafe/core-fp-result';
 *
 * const result = map(Ok(2), (value) => value * 10);
 * console.log(result.ok); // true
 * ```
 * @public
 */
export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> =>
  isOk(result)
    ? { ok: true, value: fn(result.value) }
    : (result as Result<U, E>);
