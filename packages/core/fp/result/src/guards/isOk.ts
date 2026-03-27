import type { Result } from '../types/core/index.js';

/**
 * Checks whether a `Result` is in the success branch.
 *
 * @typeParam T - The success value type.
 * @typeParam E - The error value type.
 * @param result - The `Result` to check.
 * @returns `true` when `result.ok` equals `true`.
 * @since 0.1.0
 * @see {@link isErr} - Checks the error branch.
 * @example
 * ```ts
 * import { Ok, isOk } from '@resultsafe/core-fp-result';
 *
 * const result = Ok(10);
 * console.log(isOk(result)); // true
 * ```
 * @public
 */
export const isOk = <T, E>(
  result: Result<T, E>,
): result is { ok: true; value: T } => result.ok === true;
