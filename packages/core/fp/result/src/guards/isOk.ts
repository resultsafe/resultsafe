import type { Result } from '../shared-types.js';

/**
 * Проверяет, находится ли `Result` в ветке успеха.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @param result - `Result` для проверки.
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


