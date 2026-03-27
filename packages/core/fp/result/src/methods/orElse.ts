import { isErr } from '../guards/isErr.js';
import { type Result } from '../types/core/index.js';

/**
 * Recovers from an error by transforming `Err` into another `Result`.
 *
 * @typeParam T - The success value type.
 * @typeParam E - The input error value type.
 * @typeParam F - The output error value type.
 * @param result - The source `Result`.
 * @param fn - The recovery function applied to `Err`.
 * @returns The recovered `Result` or the original `Ok`.
 * @since 0.1.0
 * @see {@link andThen} - Chains the success branch.
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
