import { isErr } from '../guards/isErr.js';
import { type Result } from '../types/core/index.js';

/**
 * Performs a side effect for the `Err` value and returns the input `Result`.
 *
 * @typeParam T - The success value type.
 * @typeParam E - The error value type.
 * @param result - The source `Result`.
 * @param fn - The side effect callback for the error branch.
 * @returns The unchanged `Result`.
 * @since 0.1.0
 * @see {@link tap} - Executes a side effect for the success branch.
 * @example
 * ```ts
 * import { Err, tapErr } from '@resultsafe/core-fp-result';
 *
 * const result = tapErr(Err('boom'), (error) => console.log(error)); // boom
 * console.log(result.ok); // false
 * ```
 * @public
 */
export const tapErr = <T, E>(
  result: Result<T, E>,
  fn: (error: E) => void,
): Result<T, E> => {
  if (isErr(result)) {
    fn(result.error);
  }
  return result;
};
