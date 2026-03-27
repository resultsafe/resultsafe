import type { Result } from '../types/core/index.js';

/**
 * Checks whether the `Result` is in the error branch.
 *
 * @typeParam T - The success value type.
 * @typeParam E - The error value type.
 * @param result - The `Result` to check.
 * @returns `true` when `result.ok` equals `false`.
 * @since 0.1.0
 * @see {@link isOk} - Checks the success branch.
 * @example
 * ```ts
 * import { Err, isErr } from '@resultsafe/core-fp-result';
 *
 * const result = Err('boom');
 * console.log(isErr(result)); // true
 * ```
 * @public
 */
export const isErr = <T, E>(
  result: Result<T, E>,
): result is { ok: false; error: E } => result.ok === false;
