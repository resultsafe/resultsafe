import type { Result } from '../shared-types.js';

/**
 * Создает успешное значение `Result` из переданного payload.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - The error type for the resulting `Result`.
 * @param value - Payload успеха для обёртки.
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


