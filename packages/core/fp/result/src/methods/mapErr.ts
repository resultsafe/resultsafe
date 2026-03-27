import { isErr } from '../guards/isErr.js';
import { type Result } from '../types/core/index.js';

/**
 * Transforms the error value while preserving the success branch.
 *
 * @typeParam T - The success value type.
 * @typeParam E - The input error value type.
 * @typeParam F - The output error value type.
 * @param result - The source `Result`.
 * @param fn - The transformation function for the error value.
 * @returns The transformed `Err` or the original `Ok`.
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
