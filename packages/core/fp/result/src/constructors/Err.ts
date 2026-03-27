import type { Result } from '../types/core/index.js';

/**
 * Создает ошибочное значение `Result` из переданного payload ошибки.
 *
 * @typeParam E - Тип значения ошибки.
 * @typeParam T - The success type for the resulting `Result`.
 * @param error - Payload ошибки для обёртки.
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
