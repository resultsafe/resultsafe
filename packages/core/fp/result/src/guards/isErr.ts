import type { Result } from '../types/core/index.js';

/**
 * Проверяет, находится ли `Result` в ветке ошибки.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @param result - `Result` для проверки.
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
