import { type Result } from '../shared-types.js';

/**
 * Схлопывает вложенный `Result<Result<T, E>, E>` на один уровень.
 *
 * @typeParam T - The inner success value type.
 * @typeParam E - The shared error value type.
 * @param result - Вложенный `Result` для схлопывания.
 * @returns A single-layer `Result<T, E>`.
 * @since 0.1.0
 * @see {@link andThen} - Chains computations that already return `Result`.
 * @example
 * ```ts
 * import { Ok, flatten } from '@resultsafe/core-fp-result';
 *
 * const value = flatten(Ok(Ok(3)));
 * console.log(value.ok); // true
 * ```
 * @public
 */
export const flatten = <T, E>(result: Result<Result<T, E>, E>): Result<T, E> =>
  result.ok ? result.value : { ok: false, error: result.error };
