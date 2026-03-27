import type { Result } from '../types/core/index.js';

/**
 * Creates a successful `Result` value from the provided payload.
 *
 * @typeParam T - The success value type.
 * @typeParam E - The error type for the resulting `Result`.
 * @param value - The success payload to wrap.
 * @returns A `Result` with `ok: true` and the provided `value`.
 * @since 0.1.0
 * @see {@link Err} - Creates an error `Result`.
 * @example
 * ```ts
 * import { Ok } from '@resultsafe/core-fp-result';
 *
 * const result = Ok<number, string>(42);
 * console.log(result.ok); // true
 * ```
 * @public
 */
export const Ok = <T, E = never>(value: T): Result<T, E> =>
  ({ ok: true, value }) as const;
