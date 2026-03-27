import { type Result } from '../types/core/index.js';

/**
 * Выполняет сопоставление `Result` в единое выходное значение.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @typeParam U - The output type returned by both handlers.
 * @param result - Исходный `Result`.
 * @param okFn - Обработчик для ветки успеха.
 * @param errFn - Обработчик для ветки ошибки.
 * @returns Выходное значение, полученное от выбранного обработчика.
 * @since 0.1.0
 * @see {@link unwrapOrElse} - Similar shape with default fallback semantics.
 * @example
 * ```ts
 * import { Ok, match } from '@resultsafe/core-fp-result';
 *
 * const value = match(Ok(3), (x) => `ok:${x}`, (e) => `err:${e}`);
 * console.log(value); // ok:3
 * ```
 * @public
 */
export const match = <T, E, U>(
  result: Result<T, E>,
  okFn: (value: T) => U,
  errFn: (error: E) => U,
): U => {
  if (result.ok) {
    return okFn(result.value);
  } else {
    const { error } = result;
    return errFn(error);
  }
};
