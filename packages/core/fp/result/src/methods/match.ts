import { type Result } from '../types/core/index.js';

/**
 * Pattern matches the `Result` into a single output value.
 *
 * @typeParam T - The success value type.
 * @typeParam E - The error value type.
 * @typeParam U - The output type returned by both handlers.
 * @param result - The source `Result`.
 * @param okFn - The handler for the success branch.
 * @param errFn - The handler for the error branch.
 * @returns The output value produced by the selected handler.
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
