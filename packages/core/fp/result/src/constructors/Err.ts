import type { Result } from '../types/core/index.js';

/**
 * Creates an error `Result` value from the provided error payload.
 *
 * @typeParam E - The error value type.
 * @typeParam T - The success type for the resulting `Result`.
 * @param error - The error payload to wrap.
 * @returns A `Result` with `ok: false` and the provided `error`.
 * @since 0.1.0
 * @see {@link Ok} - Creates a successful `Result`.
 * @example
 * ```ts
 * import { Err } from '@resultsafe/core-fp-result';
 *
 * const result = Err<string, number>('boom');
 * console.log(result.ok); // false
 * ```
 * @public
 */
export const Err = <E, T = never>(error: E): Result<T, E> =>
  ({ ok: false, error }) as const;
