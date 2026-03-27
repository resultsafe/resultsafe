import { type Result } from '../types/core/index.js';

/**
 * Returns the success value or computes a fallback from the error.
 *
 * @typeParam T - The success value type.
 * @typeParam E - The error value type.
 * @param result - The source `Result`.
 * @param fn - The fallback provider function for `Err`.
 * @returns The success payload or the computed fallback.
 * @since 0.1.0
 * @see {@link unwrapOr} - Uses an eager fallback value.
 * @example
 * ```ts
 * import { Err, unwrapOrElse } from '@resultsafe/core-fp-result';
 *
 * const value = unwrapOrElse(Err('fatal'), (error) => error.length);
 * console.log(value); // 5
 * ```
 * @public
 */
export const unwrapOrElse = <T, E>(
  result: Result<T, E>,
  fn: (error: E) => T,
): T => {
  if (result.ok) {
    return result.value;
  } else {
    return fn(result.error);
  }
};
